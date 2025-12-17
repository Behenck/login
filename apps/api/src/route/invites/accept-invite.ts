import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { hash } from 'bcryptjs'
import { generateOTP } from '@/utils/generate-otp'

export async function acceptInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/invites/:inviteId/accept',
      {
        schema: {
          tags: ['invites'],
          summary: 'Accept an invite',
          params: z.object({
            inviteId: z.uuid(),
          }),
          body: z.object({
            name: z.string(),
            lastName: z.string(),
            password: z.string().min(6)
          }),
          response: {
            200: z.object({
              code: z.string()
            }),
          },
        },
      },
      async (request, reply) => {
        const { inviteId } = request.params
        const { name, lastName, password } = request.body
        const fullName = name + " " + lastName

        const invite = await prisma.invite.findUnique({
          where: { id: inviteId },
        })

        if (!invite) {
          throw new BadRequestError('Convite não existe ou expirado')
        }

        let user = await prisma.user.findUnique({
          where: { email: invite.email },
        })

        if (!user) {
          const passwordHash = await hash(password, 6)

          user = await prisma.user.create({
            data: {
              email: invite.email,
              name: fullName,
              passwordHash,
            }
          })
        }

        if (invite.email !== user.email) {
          throw new BadRequestError('Este convite pertence a outro usuário.')
        }

        await prisma.$transaction([
          prisma.member.create({
            data: {
              userId: user.id,
              organizationId: invite.organizationId,
              role: invite.role,
              active: false
            },
          }),

          prisma.invite.delete({
            where: { id: invite.id },
          }),
        ])

        // OTP
        const otp = generateOTP()
        const otpHash = await hash(otp, 6)

        await prisma.token.create({
          data: {
            type: "EMAIL_VERIFICATION",
            token: otpHash,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
            userId: user.id,
          },
        })

        return reply.status(200).send({ code: otp })
      },
    )
}