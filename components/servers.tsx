import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { ActionIcon, Input, Text, Image } from '@mantine/core';
import Empty from './empty';
import * as StringUtils from '../utils/string';
import * as NotificationUtils from '../utils/notification';
import { Action } from '../types/portainer';
import { ServersComponentProps } from '../types/props';

const Servers = ({ filter, resources, containers }: ServersComponentProps) => {
	const router = useRouter();
	const { data: session } = useSession();

	const [search, setSearch] = useState('');
	const [statusChange, setStatusChange] = useState(['']);
	const [data, setData] = useState(containers.filter(({ state }) => state === filter));

	const handleClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
		NotificationUtils.notify('Address copied to the clipboard sucessfully');
	};

	const handleAction = async (containerId: string, action: Action) => {
		const isStart = action === 'START';

		const hasEnoughResources = resources.ram.usage < 80 || resources.cpu.usage < 80;
		if (isStart && !hasEnoughResources) {
			NotificationUtils.notify('Not enough resources', 'ERROR');
			return;
		}

		const name = containers.find(({ id }) => id === containerId)?.name;
		if (!name) {
			NotificationUtils.notify('Game server is unavailable', 'ERROR');
			return;
		}

		if (statusChange.includes(containerId)) {
			NotificationUtils.notify(`${name} server is already trying to ${action.toLowerCase()}`, 'ERROR');
			return;
		}

		const id = NotificationUtils.notify(`Attempting to ${action.toLowerCase()} the ${name} server`, 'LOADING');
		setStatusChange([...statusChange, containerId]);

		const res = await window.fetch(`${window.location.origin}/api/portainer/container`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ containerId, action }),
		});
		const data = await res.json();

		if (!res.ok) {
			NotificationUtils.update(id, data.error, 'ERROR');
			return setStatusChange([...statusChange.filter((id) => id !== containerId)]);
		}

		NotificationUtils.update(id, `${name} server has ${isStart ? 'started' : 'stopped'} successfully`);
		router.reload();

		setStatusChange([...statusChange.filter((id) => id !== containerId)]);
	};

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	const searchGameServer = () => {
		if (!search) return setData([...containers.filter(({ state }) => state === filter)]);
		if (search.length < 3) return;

		const regExp = new RegExp(`${search.toLowerCase()}`);
		setData([...data.filter(({ name }) => regExp.test(name))]);
	};

	useEffect(() => {
		searchGameServer();
	}, [search]);

	return (
		<div className={`${styles.column} ${styles.multiple}`}>
			<h2>{filter === 'ONLINE' ? 'Running' : 'Stopped'}</h2>
			<Input
				className={styles.search}
				icon={<Image src="/svg/search.svg" alt="Search Icon" width={32} height={32} />}
				placeholder="Which container are you looking for?"
				onChange={handleSearch}
			/>
			<div className={styles.grid}>
				{data.length === 0 ? (
					<Empty />
				) : (
					data.map(({ id, name, status, address }) => (
						<div className={styles.card} key={id}>
							<div className={styles.top}>
								<Text className={styles.title}>{StringUtils.capitalize(name)}</Text>
								{filter === 'ONLINE' ? (
									<ActionIcon variant="transparent" onClick={() => handleAction(id, 'STOP')}>
										<Image src="/svg/stop.svg" alt="Stop Icon" width={32} height={32} />
									</ActionIcon>
								) : (
									<ActionIcon variant="transparent" onClick={() => handleAction(id, 'START')}>
										<Image src="/svg/start.svg" alt="Start Icon" width={32} height={32} />
									</ActionIcon>
								)}
							</div>
							<div className={styles.mid}>
								<div className={styles.state}>
									<span className={filter === 'ONLINE' ? styles.online : styles.offline} />
									&nbsp;&nbsp;&nbsp;
									<Text size="xl">{StringUtils.capitalize(filter.toLowerCase())}</Text>
								</div>
								<Text size="xl">{status}</Text>
							</div>
							{filter === 'ONLINE' ? (
								<div className={styles.bottom}>
									{session?.user.hasReadPermissions ? (
										<>
											{address}
											<ActionIcon variant="transparent" onClick={() => handleClipboard(address)}>
												<Image
													src="/svg/clipboard.svg"
													alt="Clipboard Icon"
													width={32}
													height={32}
												/>
											</ActionIcon>
										</>
									) : (
										<>
											{'Login to view'}
											<ActionIcon disabled>
												<Image
													src="/svg/clipboard.svg"
													alt="Clipboard Icon"
													width={32}
													height={32}
												/>
											</ActionIcon>
										</>
									)}
								</div>
							) : (
								''
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Servers;
