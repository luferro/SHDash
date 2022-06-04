import { NotificationProps, showNotification, updateNotification } from '@mantine/notifications';
import { randomBytes } from 'crypto';
import { Notification } from '../types/notification';

const config: Record<Notification, Omit<NotificationProps, 'message'>> = {
	SUCCESS: { color: 'green' },
	ERROR: { color: 'red' },
	LOADING: { loading: true, autoClose: false, disallowClose: true },
};

export const notify = (message: string, type: Notification = 'SUCCESS') => {
	const id = randomBytes(16).toString('hex');
	showNotification({ id, message, ...config[type] });

	return id;
};

export const update = (id: string, message: string, type: Notification = 'SUCCESS') => {
	updateNotification({ id, message, ...config[type] });
};
