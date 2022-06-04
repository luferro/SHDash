import mongoose, { Model } from 'mongoose';

interface Logs {
	id: string;
	username: string;
	createdAt: Date;
	updatedAt: Date;
}

const schema = new mongoose.Schema<Logs>(
	{
		id: { type: String, required: true },
		username: { type: String, required: true },
	},
	{ timestamps: true },
);

export const logsModel: Model<Logs> = mongoose.models.logs ?? mongoose.model('logs', schema);
