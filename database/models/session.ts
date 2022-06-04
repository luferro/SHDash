import mongoose, { Model } from 'mongoose';

interface Session {
	token: string;
	createdAt: Date;
	updatedAt: Date;
}

const schema = new mongoose.Schema<Session>({ token: { type: String, required: true } }, { timestamps: true });

export const sessionModel: Model<Session> = mongoose.models.session ?? mongoose.model('session', schema, 'session');
