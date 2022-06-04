import mongoose, { Model } from 'mongoose';
import { TicketType, TicketStatus } from '../../types/ticket';

interface Tickets {
	type: TicketType;
	title: string;
	description: string;
	status: TicketStatus;
	completedAt: number | null;
	createdAt: Date;
	updatedAt: Date;
}

const schema = new mongoose.Schema<Tickets>(
	{
		type: { type: String, required: true },
		title: { type: String, required: true },
		description: { type: String, required: true },
		status: { type: String, required: true },
		completedAt: { type: Number, required: true },
	},
	{ timestamps: true },
);

export const ticketsModel: Model<Tickets> = mongoose.models.tickets ?? mongoose.model('tickets', schema);
