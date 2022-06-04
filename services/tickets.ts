import { ticketsModel } from '../database/models/tickets';
import { Tickets } from '../types/response';
import { TicketStatus, TicketType } from '../types/ticket';

const cache = new Map<TicketType, Tickets['tickets']>();

const updateCachedTickets = async (type: TicketType) => {
	const tickets = await ticketsModel.find({ type });
	if (tickets.length === 0) return;

	cache.set(
		type,
		tickets.map(({ type, title, description, status, completedAt, createdAt, updatedAt }) => ({
			type,
			title,
			description,
			status,
			completedAt,
			createdAt: new Date(createdAt).getTime(),
			updatedAt: new Date(updatedAt).getTime(),
		})),
	);
};

const getCachedTickets = (type: TicketType, page: number, limit: number, filter: 'ALL' & TicketStatus) => {
	const tickets = cache.get(type)!;

	const filteredTickets = tickets
		.sort((a, b) => b.updatedAt - a.updatedAt)
		.filter(({ status }) => (filter === 'ALL' ? status : status === filter));

	return {
		total: filteredTickets.length,
		tickets: filteredTickets.slice((page - 1) * limit, page * limit),
	};
};

export const createTicket = async (type: TicketType, title: string, description: string) => {
	const ticket = await ticketsModel.findOne({ title: { $regex: new RegExp(title, 'i') } });
	if (ticket) throw new Error(`There is already a ${type} ticket for ${title}`);

	const ticketInfo = {
		description,
		status: 'IN REVIEW',
		completedAt: null,
	};

	await ticketsModel.updateOne({ type, title }, { $set: ticketInfo }, { upsert: true });
	await updateCachedTickets(type);

	return {
		message: `${type} ticket for ${title} has been submitted`,
	};
};

export const getTickets = async (type: TicketType, page: number, limit: number, filter: 'ALL' & TicketStatus) => {
	if (!cache.has(type)) await updateCachedTickets(type);
	const { total, tickets } = getCachedTickets(type, page, limit, filter);

	return {
		total,
		tickets: tickets.map(({ type, title, description, status, completedAt, createdAt, updatedAt }) => ({
			type,
			title,
			description,
			status,
			completedAt,
			createdAt: new Date(createdAt).getTime(),
			updatedAt: new Date(updatedAt).getTime(),
		})),
	};
};

export const updateTicket = async (type: TicketType, title: string, status: TicketStatus) => {
	const ticket = await ticketsModel.findOne({ type, title: { $regex: new RegExp(title, 'i') } });
	if (!ticket) throw new Error(`There is no request for ${title}`);

	const ticketInfo = {
		status,
		completedAt: status === 'COMPLETED' ? Date.now() : null,
	};

	await ticketsModel.updateOne({ type, title }, { $set: ticketInfo });
	await updateCachedTickets(type);

	return {
		message: `${type} ticket for ${title} has been marked as ${status}`,
	};
};
