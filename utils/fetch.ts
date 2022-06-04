import { request } from 'undici';
import UserAgent from 'user-agents';
import { Request } from '../types/request';

export const fetch = async <T>({ url, method = 'GET', authorization, body }: Request): Promise<T> => {
	const res = await request(url, {
		method,
		headers: {
			'User-Agent': new UserAgent().toString(),
			'content-type': body instanceof URLSearchParams ? 'application/x-www-form-urlencoded' : 'application/json',
			'Authorization': authorization,
		},
		body: body?.toString(),
	});

	if (res.statusCode >= 400) {
		await res.body.dump();
		throw new Error(`${method} to ${url} request failed. Status code: ${res.statusCode}`);
	}

	return res.headers['content-type']?.includes('application/json') ? await res.body.json() : await res.body.text();
};
