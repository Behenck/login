import { auth } from "@/middleware/auth";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@sass/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { BadRequestError } from "../_errors/bad-request-error";
import { prisma } from "@/lib/prisma";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post("/organizations/:slug/invites", {
      schema: {
        tags: ["invites"],
        summary: "Create an invite for an organization",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string()
        }),
        body: z.object({
          email: z.email(),
          role: roleSchema
        }),
        response: {
          201: z.object({
            inviteId: z.uuid()
          })
        }
      }
    },
    async (request, reply) => {
      const { slug } = request.params;
      const userId = await request.getCurrentUserId()
      const { membership, organization } = await request.getUserMembership(slug)
    
      const {cannot} = getUserPermissions(userId, membership.role)

      if (cannot("create", "Invite")) {
        throw new UnauthorizedError("You're not allowed to create new invites.")
      }

      const { email, role } = request.body;

      const [, domain] = email.split('@')

      if (
        organization.shouldAttachUserByDomain &&
        organization.domain === domain
      ) {
        throw new BadRequestError(`Users with ${domain} will join your organization automatically on login`)
      }

      const inviteWithSameEmail = await prisma.invite.findUnique({
        where: {
          email_organizationId: {
            email,
            organizationId: organization.id
          }
        }
      })

      if (inviteWithSameEmail) {
        throw new BadRequestError(
          'Another invite with same e-mail already exists.',
        )
      }

      const memberWithSameEmail = await prisma.member.findFirst({
        where: {
          organizationId: organization.id,
          user: {
            email
          }
        }
      })

      if (memberWithSameEmail) {
        throw new BadRequestError(
          'A member with this e-mail belonge to your organization.',
        )
      }

      const invite = await prisma.invite.create({
        data: {
          organizationId: organization.id,
          email,
          role,
          authorId: userId
        }
      })

      return reply.status(201).send({
        inviteId: invite.id
      })
    }
  )
}