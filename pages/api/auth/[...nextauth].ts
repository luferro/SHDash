import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { logsModel } from '../../../database/models/logs';
import * as Discord from '../../../services/discord';

export default NextAuth({
	secret: process.env.OAUTH2_SECRET,
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID!,
			clientSecret: process.env.DISCORD_CLIENT_SECRET!,
			authorization: { params: { scope: 'identify guilds' } },
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 60 * 60 * 24 * 365,
	},
	callbacks: {
		jwt: async ({ token, user, account }) => {
			if (user && account) {
				const { id, name, image } = user;
				const { access_token, refresh_token, expires_at } = account;

				await logsModel.updateOne({ id }, { $set: { username: name } }, { upsert: true });

				const guilds = await Discord.getUserGuilds(access_token);
				const belongsToGuild = guilds.find(({ id }) => id === process.env.DISCORD_GUILD_ID);

				return {
					user: {
						id,
						username: name,
						avatar: image,
						isAdmin: id === process.env.DISCORD_GUILD_ADMIN,
						hasReadPermissions: Boolean(belongsToGuild),
						hasWritePermissions: Boolean(belongsToGuild),
					},
					accessToken: access_token,
					refreshToken: refresh_token,
					expiry: Date.now() + expires_at * 1000,
				};
			}
			const { refreshToken, expiry } = token;

			if (Date.now() >= expiry) {
				const { access_token, refresh_token, expires_in } = await Discord.exchangeRefreshToken(refreshToken);
				return {
					...token,
					accessToken: access_token,
					refreshToken: refresh_token ?? refreshToken,
					expiry: Date.now() + expires_in * 1000,
				};
			}

			return token;
		},
		session: ({ session, token }) => {
			session.user = token.user;
			session.accessToken = token.accessToken;
			session.error = token.error;

			return session;
		},
	},
});
