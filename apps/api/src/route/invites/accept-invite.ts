import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { hash } from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { BadRequestError } from "../_errors/bad-request-error"
import { generateOTP } from "@/utils/generate-otp"

export async function acceptInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/invites/:inviteId/accept",
    {
      schema: {
        tags: ["invites"],
        summary: "Accept an invite",
        params: z.object({
          inviteId: z.uuid(),
        }),
        body: z.object({
          name: z.string().optional(),
          lastName: z.string().optional(),
          password: z.string().min(6).optional(),
        }),
        response: {
          204: z.null(),
          200: z.object({ code: z.string() }), // dev only
        },
      },
    },
    async (request, reply) => {
      const { inviteId } = request.params
      const { name, lastName, password } = request.body
      const fullName = `${name ?? ""} ${lastName ?? ""}`.trim()

      const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
      })

      if (!invite) {
        throw new BadRequestError("Convite não existe ou expirado.")
      }

      let user = await prisma.user.findUnique({
        where: { email: invite.email },
      })

      if (!user) {
        if (!password) {
          throw new BadRequestError("Crie uma senha para finalizar seu cadastro.")
        }

        const passwordHash = await hash(password, 6)

        user = await prisma.user.create({
          data: {
            email: invite.email,
            name: fullName || null,
            passwordHash,
          },
        })
      }

      // OTP
      const otp = generateOTP()
      const otpHash = await hash(otp, 6)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

      await prisma.$transaction([
        prisma.member.create({
          data: {
            userId: user.id,
            organizationId: invite.organizationId,
            role: invite.role,
            active: true,
          },
        }),

        // invalida tokens antigos (se existir)
        prisma.token.updateMany({
          where: {
            userId: user.id,
            type: "EMAIL_VERIFICATION",
            usedAt: null,
          },
          data: { usedAt: new Date() },
        }),

        prisma.token.create({
          data: {
            type: "EMAIL_VERIFICATION",
            token: otpHash,
            expiresAt,
            userId: user.id,
          },
        }),

        prisma.invite.delete({
          where: { id: invite.id },
        }),
      ])

      if (process.env.NODE_ENV !== "production") {
        return reply.status(200).send({ code: otp })
      }

      return reply.status(204).send()
    },
  )
}
