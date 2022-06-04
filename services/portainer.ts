import { fetch } from '../utils/fetch';
import { sessionModel } from '../database/models/session';
import { Action } from '../types/portainer';
import { Container, JwtToken } from '../types/response';

const getAuthorization = async (): Promise<string | undefined> => {
	const session = await sessionModel.findOne({});
	return session?.token;
};

export const login = async () => {
	const body = {
		username: process.env.PORTAINER_USERNAME,
		password: process.env.PORTAINER_PASSWORD,
	};

	const { jwt } = await fetch<JwtToken>({
		url: `${process.env.PORTAINER_URL}/api/auth`,
		method: 'POST',
		body: JSON.stringify(body),
	});

	const session = await sessionModel.findOne({});
	if (!session) await sessionModel.collection.insertOne({ token: jwt });
	else await sessionModel.updateOne({}, { $set: { token: jwt } });
};

export const list = async () => {
	const authorization = await getAuthorization();

	const data = await fetch<Container[]>({
		url: `${process.env.PORTAINER_URL}/api/endpoints/${process.env.PORTAINER_ENVIRONMENT}/docker/containers/json?all=true`,
		authorization: `Bearer ${authorization}`,
	});

	return data
		.filter(({ Labels }) => Labels['com.docker.compose.project'] === 'game-servers')
		.map(({ Id, Labels, Names, Image, ImageID, State, Status }) => {
			const containerName = Labels['com.docker.compose.service'] ?? Names[0];

			return {
				id: Id,
				name: containerName,
				image: Image,
				imageId: ImageID,
				address: `${containerName}.${process.env.DOMAIN}`,
				state: State === 'running' ? 'ONLINE' : 'OFFLINE',
				status: Status,
			};
		})
		.sort((a, b) => a.name.localeCompare(b.name));
};

export const container = async (containerId: string, action: Action) => {
	const authorization = await getAuthorization();

	await fetch({
		url: `${process.env.PORTAINER_URL}/api/endpoints/${
			process.env.PORTAINER_ENVIRONMENT
		}/docker/containers/${containerId}/${action.toLowerCase()}`,
		method: 'POST',
		authorization: `Bearer ${authorization}`,
	});
};
