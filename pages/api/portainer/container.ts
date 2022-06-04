import type { NextApiRequest, NextApiResponse } from 'next';
import * as Portainer from '../../../services/portainer';
import * as TokenUtils from '../../../utils/token';

const validate = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', ['POST']);
		return res.status(405).end(`Method ${req.method} not allowed`);
	}

	const session = await TokenUtils.getSession(req);
	if (!session) return res.status(401).json({ error: 'Authentication is required for this action' });

	if (!session.user.hasWritePermissions)
		return res.status(403).json({ error: 'Missing permission to interact with the containers' });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		await validate(req, res);
		if (res.headersSent) return;

		const { containerId, action } = req.body;
		if (!containerId) return res.status(422).json({ error: `Missing containerId` });
		if (!['START', 'STOP'].includes(action)) return res.status(422).json({ error: `Inavlid container action` });

		await Portainer.container(containerId, action);
		res.status(200).json({ message: `Container ${containerId} has started successfully` });
	} catch (error) {
		res.status(500).json({ error: (<Error>error).message });
	}
};
