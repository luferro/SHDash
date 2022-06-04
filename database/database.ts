import mongoose, { ConnectOptions } from 'mongoose';

export const connect = async () => {
	const options = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	} as ConnectOptions;

	await mongoose.connect(process.env.MONGO_URI!, options);
};
