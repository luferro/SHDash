import { fetch } from '../utils/fetch';
import { DiscordToken, DiscordGuild } from '../types/response';

export const exchangeRefreshToken = async (refreshToken: string) => {
	const formData = new URLSearchParams();
	formData.append('client_id', process.env.DISCORD_CLIENT!);
	formData.append('client_secret', process.env.DISCORD_SECRET!);
	formData.append('grant_type', 'refresh_token');
	formData.append('refresh_token', refreshToken);

	return await fetch<DiscordToken>({
		url: 'https://discord.com/api/oauth2/token',
		method: 'POST',
		body: formData,
	});
};

export const getUserGuilds = async (authorization: string) => {
	return await fetch<DiscordGuild[]>({
		url: 'https://discord.com/api/users/@me/guilds',
		authorization: `Bearer ${authorization}`,
	});
};
