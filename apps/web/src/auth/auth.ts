import { api } from '@/lib/axios'
import { definedAbilityFor } from '@sass/auth'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export function isAuthenticated() {
  return !!Cookies.get("token")
}

export function getCurrentOrg() {
  return Cookies.get("org") ?? null
}

export async function getCurrentMembership() {
  const org = getCurrentOrg()

  if (!org) {
    return null
  }

  const { data } = await api.get(`/organization/${org}/membership`)

  return data.membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = definedAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  const token = Cookies.get("token")
  const navigate = useNavigate()

  if (!token) {
    navigate('/auth/sign-in')
  }

  try {
    const { data } = await api.get("/profile")

    return data.user
  } catch {}

  navigate('auth/sign-out')
}