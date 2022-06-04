import { TicketStatus, TicketType } from './ticket';

export interface JwtToken {
	jwt: string;
}

export interface Container {
	Id: string;
	Image: string;
	ImageID: string;
	Names: string[];
	Labels: {
		[key: string]: string;
	};
	State: string;
	Status: string;
}

export interface DiscordToken {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string;
	token_type: string;
}

export interface DiscordGuild {
	id: string;
	name: string;
	icon: string;
	owner: boolean;
	permissions: string;
	features: string[];
}

export interface Tickets {
	total: number;
	tickets: {
		type: TicketType;
		title: string;
		description: string;
		status: TicketStatus;
		completedAt: number | null;
		createdAt: number;
		updatedAt: number;
	}[];
}
