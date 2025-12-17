import { z } from 'zod'

export const typeInviteSchema = z.union([
  z.literal('EMAIL'),
  z.literal('LINK'),
])

export type TypeInvite = z.infer<typeof typeInviteSchema>