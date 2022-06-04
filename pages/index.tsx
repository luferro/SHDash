import styles from '../styles/Home.module.css';
import Head from 'next/head';
import * as Database from '../database/database';
import * as Portainer from '../services/portainer';
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import Servers from '../components/servers';
import Resources from '../components/resources';
import * as OsUtils from '../utils/os';
import * as TokenUtils from '../utils/token';
import { ServerSideRenderProps } from '../types/props';

export const getServerSideProps = async () => {
	await Database.connect();

	const isPortainerTokenValid = await TokenUtils.isPortainerTokenValid();
	if (!isPortainerTokenValid) await Portainer.login();

	const resources = await OsUtils.getResources();
	const containers = await Portainer.list();

	return {
		props: {
			resources,
			containers,
		},
	};
};

const Home = ({ resources, containers }: ServerSideRenderProps) => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Dashboard</title>
				<meta
					name="description"
					content="Simple dashboard to start and stop self hosted game servers on portainer"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<NavBar />

			<main className={styles.main}>
				<div className={styles.list}>
					<Resources resources={resources} />
				</div>

				<div className={styles.list}>
					<Servers filter="OFFLINE" resources={resources} containers={containers} />
					<Servers filter="ONLINE" resources={resources} containers={containers} />
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default Home;
