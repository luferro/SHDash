import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { NotificationsProvider } from '@mantine/notifications';

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<NotificationsProvider position="top-right">
				<Component {...pageProps} />
			</NotificationsProvider>
		</SessionProvider>
	);
};

export default MyApp;
