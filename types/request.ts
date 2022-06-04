type HttpMethods = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';

export interface Request {
	url: string | URL;
	method?: HttpMethods;
	authorization?: string;
	body?: string | URLSearchParams;
}
