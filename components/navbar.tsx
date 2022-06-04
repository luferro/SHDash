import styles from '../styles/Home.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { ActionIcon, Avatar, Divider, Menu, Modal, Text, Image } from '@mantine/core';
import RequestForm from './requestForm';
import RequestTable from './requestTable';

const NavBar = () => {
	const { data: session } = useSession();

	const [modals, setModals] = useState({
		openCreateModal: false,
		openListModal: false,
	});

	return (
		<header className={styles.header}>
			<nav className={styles.nav}>
				<div>
					<Text className={styles.logo} size="xl">
						<b>
							<span>SH</span>Dash
						</b>
					</Text>
					<Text className={styles.description} size="sm">
						Simple dashboard to start and stop self hosted game servers on portainer
					</Text>
				</div>
				{session ? (
					<Menu
						size="lg"
						shadow="xl"
						gutter={15}
						classNames={{
							body: styles.menu,
							label: styles.label,
							item: styles.item,
						}}
						control={
							<ActionIcon variant="transparent" className={styles.user}>
								<Avatar
									alt={`${session.user.username}'s avatar`}
									src={session.user.avatar}
									size="lg"
									radius="xl"
								/>
							</ActionIcon>
						}
					>
						<Menu.Label className={styles.username}>
							Hi,&nbsp;<span>{session.user.username}</span>
						</Menu.Label>
						<Divider />
						<Menu.Label>Application</Menu.Label>
						<Menu.Item
							icon={<Image src="/svg/add.svg" alt="Add Request Icon" width={24} height={24} />}
							onClick={() => setModals({ ...modals, openCreateModal: true })}
						>
							Server request
						</Menu.Item>
						<Menu.Item
							icon={<Image src="/svg/list.svg" alt="List Requests Icon" width={24} height={24} />}
							onClick={() => setModals({ ...modals, openListModal: true })}
						>
							See requests
						</Menu.Item>
						<Divider />
						<Menu.Label>Danger zone</Menu.Label>
						<Menu.Item
							className={styles.danger}
							icon={<Image src="/svg/logout.svg" alt="Logout Icon" width={24} height={24} />}
							onClick={() => signOut()}
						>
							Logout
						</Menu.Item>
					</Menu>
				) : (
					<ActionIcon variant="transparent" className={styles.login} onClick={() => signIn('discord')}>
						<Text>Login with</Text>
						&nbsp;
						<Image src="/svg/discord.svg" alt="Discord Icon" width={32} height={32} />
					</ActionIcon>
				)}
			</nav>

			<Modal
				classNames={{
					modal: `${styles.modal} ${styles.form}`,
					body: styles.body,
					close: styles.close,
				}}
				opened={modals.openCreateModal}
				onClose={() => setModals({ ...modals, openCreateModal: false })}
				title="Server request"
			>
				<RequestForm />
			</Modal>

			<Modal
				classNames={{
					modal: `${styles.modal} ${styles.table}`,
					body: styles.body,
					close: styles.close,
				}}
				opened={modals.openListModal}
				onClose={() => setModals({ ...modals, openListModal: false })}
				title="See requests"
			>
				<RequestTable />
			</Modal>
		</header>
	);
};

export default NavBar;
