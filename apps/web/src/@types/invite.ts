export interface Invite {
	author: {
		id: string;
		name: string;
		avatarUrl: string;
	};
	email?: string;
	id: string;
	role: string;
	type: string;
	organization: {
		name: string;
		domain?: string;
	};
	createdAt: Date;
}
