import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { hash } from "bcryptjs"

import { prisma } from "@/lib/prisma"
import { BadRequestError } from "../_errors/bad-request-error"
import { generateOTP } from "@/utils/generate-otp"
import { Resend } from "resend"

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
          email: z.string().email().optional(),
          lastName: z.string().optional(),
          password: z.string().min(6).optional(),
        }),
        response: {
          204: z.null(),
          200: z.object({ code: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { inviteId } = request.params
      const { name, lastName, email, password } = request.body
      const fullName = `${name ?? ""} ${lastName ?? ""}`.trim()

      const invite = await prisma.invite.findUnique({
        where: { id: inviteId },
      })

      if (!invite) {
        throw new BadRequestError("Convite não existe ou expirado.")
      }

      const finalEmail =
        invite.type === "EMAIL"
          ? invite.email
          : email

      if (!finalEmail) {
        throw new BadRequestError("Informe o e-mail para aceitar o convite.")
      }

      if (invite.type === "EMAIL" && invite.email && finalEmail !== invite.email) {
        throw new BadRequestError("Este convite é válido apenas para o e-mail informado.")
      }

      let user = await prisma.user.findUnique({
        where: { email: finalEmail },
      })

      if (!user) {
        if (!password) {
          throw new BadRequestError("Crie uma senha para finalizar seu cadastro.")
        }

        const passwordHash = await hash(password, 6)

        user = await prisma.user.create({
          data: {
            email: finalEmail,              // ✅ aqui também
            name: fullName || null,
            passwordHash,
          },
        })
      }

      // OTP
      const otp = generateOTP()
      const otpHash = await hash(otp, 6)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) //5min

      await prisma.$transaction([
        prisma.member.create({
          data: {
            userId: user.id,
            organizationId: invite.organizationId,
            role: invite.role,
            active: true,
          },
        }),

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

      const resend = new Resend(process.env.RESEND_API_KEY);

      const { error } = 
        await resend.emails.send({
          to: ["denilsontrespa10@gmail.com"],
          template: {
            id: "verification-code",
            variables: {
              otpCode: otp,
            }
          }
        });

      if (error) {
        request.log.error({ error }, "Resend failed to send email")
        throw new BadRequestError(error.message)
      }

      return reply.status(204).send()
    },
  )
}
