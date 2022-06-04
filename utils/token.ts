import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sessionModel } from '../database/models/session';

export const isPortainerTokenValid = async () => {
	const session = await sessionModel.findOne({});
	if (!session) return false;

	const { exp } = jwt.decode(session.token) as JwtPayload;
	if (!exp) return false;

	return Date.now() <= exp * 1000;
};

export const getSession = async (req: NextApiRequest) => {
	return await getToken({ req, secret: process.env.OAUTH2_SECRET });
};
