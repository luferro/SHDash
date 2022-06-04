import type { NextApiRequest, NextApiResponse } from 'next';
import * as Tickets from '../../../services/tickets';
import * as TokenUtils from '../../../utils/token';
import { TicketStatus } from '../../../types/ticket';

const validate = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT') {
		res.setHeader('Allow', ['GET', 'POST', 'PUT']);
		return res.status(405).end(`Method ${req.method} not allowed`);
	}

	const session = await TokenUtils.getSession(req);
	if (!session) return res.status(401).json({ error: 'Authentication is required for this action' });

	if (!session.user.hasWritePermissions && !session.user.hasReadPermissions)
		return res.status(403).json({ error: 'Missing permission to interact with the containers' });
};

const createRequest = async (req: NextApiRequest, res: NextApiResponse) => {
	const { title, description } = req.body;

	try {
		const { message } = await Tickets.createTicket('REQUEST', title, description);
		res.status(201).json({ message });
	} catch (error) {
		res.status(409).json({ error: (error as Error).message });
	}
};

const getRequests = async (req: NextApiRequest, res: NextApiResponse) => {
	const { page, limit, filter } = req.query;
	const { total, tickets } = await Tickets.getTickets(
		'REQUEST',
		Number(page),
		Number(limit),
		filter as 'ALL' & TicketStatus,
	);
	res.status(200).json({ total, tickets });
};

const updateRequest = async (req: NextApiRequest, res: NextApiResponse) => {
	const { title, status } = req.body;

	try {
		const { message } = await Tickets.updateTicket('REQUEST', title, status);
		res.status(200).json({ message });
	} catch (error) {
		res.status(404).json({ error: (error as Error).message });
	}
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const method = req.method as string;

	try {
		await validate(req, res);
		if (res.headersSent) return;

		const getMethod = () => {
			const options: Record<string, (req: NextApiRequest, res: NextApiResponse) => Promise<void>> = {
				GET: getRequests,
				POST: createRequest,
				PUT: updateRequest,
			};
			return options[method](req, res);
		};

		await getMethod();
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
};
