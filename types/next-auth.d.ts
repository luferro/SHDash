import 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			username: string;
			avatar: string;
			isAdmin: boolean;
			hasReadPermissions: boolean;
			hasWritePermissions: boolean;
		};
		accessToken: string;
	}

	interface User {
		id: string;
		name: string;
		image: string;
	}

	interface Account {
		access_token: string;
		refresh_token: string;
		expires_at: number;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		user: {
			id: string;
			username: string;
			avatar: string;
			isAdmin: boolean;
			hasReadPermissions: boolean;
			hasWritePermissions: boolean;
		};
		accessToken: string;
		refreshToken: string;
		expiry: number;
	}
}
