import { definedAbilityFor, Role, userSchema } from '@sass/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = definedAbilityFor(authUser)

  return ability
}