import { api } from "@/lib/axios";

export async function getOrganizationMembers() {
	const organizationId = "";
	const res = await api.get(`/organizations/:id/members`);
}

export function useGetOrganizationMembers() {}
