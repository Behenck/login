import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  type  ZodTypeProvider
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifyCors } from '@fastify/cors'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { createAccount } from './route/auth/create-account'
import fastifyJwt from '@fastify/jwt'
import { authenticateWithPassword } from './route/auth/authenticate-with-password'
import { getProfile } from './route/auth/get-profile'
import { refreshTokenRoute } from './route/auth/refresh-token'
import { requestPasswordRecover } from './route/auth/request-password-recover'
import { resetPassword } from './route/auth/reset-password'
import { createOrganization } from './route/orgs/create-organization'
import { updateOrganization } from './route/orgs/update-organization'
import { getOrganization } from './route/orgs/get-organization'
import { getOrganizations } from './route/orgs/get-organizations'
import { shutdownOrganization } from './route/orgs/shutdown-organization'
import { getMembership } from './route/orgs/get-membership'
import { acceptInvite } from './route/invites/accept-invite'
import { createInvite } from './route/invites/create-invite'
import { getInvite } from './route/invites/get-invite'
import { getInvites } from './route/invites/get-invites'
import { getPendingInvites } from './route/invites/get-pending-invites'
import { rejectInvite } from './route/invites/reject-invite'
import { revokeInvite } from './route/invites/revoke-invite'
import { getMembers } from './route/members/get-members'
import { removeMember } from './route/members/remove-member'
import { updateMember } from './route/members/update-member'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true, // envie automaticamente os cookies (auth via sessões)
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Webhook Inspector API',
      description: 'API for capturing and inspecting webhook requests',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: "JWT"
        }
      }
    }
  },
  transform: jsonSchemaTransform
})

app.register(ScalarApiReference, {
  routePrefix: '/docs',
  configuration: {
    authentication: {
      preferredSecurityScheme: "bearerAuth",
      preauthorizeApiKey: "Bearer ",
    },
  },
})

app.get('/health', async () => {
  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }
})

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
  throw new Error('🚨 variável de ambiente JWT_SECRET não definida!')
}

app.register(fastifyJwt, {
  secret: jwtSecret,
  sign: {
    expiresIn: '7d'
  }
})

/*  Auth  */
app.register(authenticateWithPassword)
app.register(createAccount)
app.register(refreshTokenRoute)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(getProfile)

/*  Orgs  */
app.register(createOrganization)
app.register(updateOrganization)
app.register(getMembership)
app.register(getOrganization)
app.register(getOrganizations)
app.register(shutdownOrganization)

/* Invites */
app.register(acceptInvite)
app.register(createInvite)
app.register(getInvite)
app.register(getInvites)
app.register(getPendingInvites)
app.register(rejectInvite)
app.register(revokeInvite)

/* Members */
app.register(getMembers)
app.register(removeMember)
app.register(updateMember)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('🔥 HTTP server running on http://localhost:3333')
  console.log('📚 Docs available at http://localhost:3333/docs')
})
