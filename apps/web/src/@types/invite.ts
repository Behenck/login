export interface Invite {
	author: {
		id: string;
		name: string;
		avatarUrl: string;
	};
	email: string;
	id: string;
	role: string;
	organization: {
		name: string;
	};
	createdAt: Date;
}
