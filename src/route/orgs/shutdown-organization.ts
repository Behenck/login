import { organizationSchema } from "@/@types/organization";
import { prisma } from "@/lib/prisma";
import { auth } from "@/middleware/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function shutdownOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete("/organization/:slug", {
      schema: {
        tags: ["organizations"],
        summary: "Shutdown Organization",
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string()
        }),
        response: {
          204: z.null()
        }
      }
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()
      const { slug } = request.params

      const { organization, membership } = await request.getUserMembership(slug)

      const authOrganization = organizationSchema.parse(organization)

      await prisma.organization.delete({
        where: {
          id: organization.id
        }
      })

      return reply.status(204).send()
    }
  )
}