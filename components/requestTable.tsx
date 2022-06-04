import styles from '../styles/Home.module.css';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Group, Pagination, SegmentedControl, Table, Text } from '@mantine/core';
import * as NotificationUtils from '../utils/notification';
import { Tickets } from '../types/response';
import { TicketStatus } from '../types/ticket';

const ITEMS_PER_PAGE = 10;

const REQUEST_STATUS: TicketStatus[] = ['IN REVIEW', 'DECLINED', 'ACCEPTED', 'PENDING', 'COMPLETED'];

const getBadgeColor = (label: string) => {
	const options: Record<string, string> = {
		'IN REVIEW': '#B7FBFF',
		'DECLINED': '#FD5D5D',
		'ACCEPTED': '#00FFAB',
		'PENDING': '#FFD36E',
		'COMPLETED': '#00FFF0',
	};
	return options[label] ?? 'gray';
};

const isStatusAllowed = (oldStatus: TicketStatus, newStatus: TicketStatus) => {
	return (
		(oldStatus === 'IN REVIEW' && (newStatus === 'DECLINED' || newStatus === 'ACCEPTED')) ||
		(oldStatus === 'DECLINED' && false) ||
		(oldStatus === 'ACCEPTED' && newStatus === 'PENDING') ||
		(oldStatus === 'PENDING' && newStatus === 'COMPLETED') ||
		(oldStatus === 'COMPLETED' && false)
	);
};

const RequestTable = () => {
	const { data: session } = useSession();

	const [page, setPage] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [rows, setRows] = useState<JSX.Element[]>([]);
	const [tableChange, setTableChange] = useState(false);
	const [filter, setFilter] = useState('ALL');

	const handlePageChange = (page: number) => {
		setPage(page);
	};

	const getTickets = async () => {
		if (!session) return;
		const res = await window.fetch(
			`${window.location.origin}/api/tickets/requests?page=${page}&limit=${ITEMS_PER_PAGE}&filter=${filter}`,
		);
		if (!res.ok) return;

		const { total, tickets } = (await res.json()) as Tickets;
		const rows = tickets
			.sort((a, b) => b.updatedAt - a.updatedAt)
			.map(({ title, description, completedAt, status }) => (
				<tr key={title}>
					<td>{title}</td>
					<td>{description}</td>
					<td>{completedAt ? new Date(completedAt).toISOString() : 'Not completed'}</td>
					<td>
						<div
							className={styles.badge}
							style={{
								color: getBadgeColor(status),
								borderColor: getBadgeColor(status),
							}}
						>
							{status}
						</div>
					</td>
					{session?.user.isAdmin ? (
						<td style={{ display: 'table-cell' }}>
							{REQUEST_STATUS.filter((newStatus) => isStatusAllowed(status, newStatus)).length === 0
								? 'There are no options available'
								: ''}
							{REQUEST_STATUS.filter((newStatus) => isStatusAllowed(status, newStatus)).map(
								(newStatus) => (
									<div
										key={newStatus}
										className={styles.badge}
										onClick={() => handleStatusChange(title, newStatus)}
										style={{
											color: getBadgeColor(newStatus),
											borderColor: getBadgeColor(newStatus),
										}}
									>
										{newStatus}
									</div>
								),
							)}
						</td>
					) : (
						''
					)}
				</tr>
			));

		setRows(rows);
		setTotalItems(total);
	};

	const handleStatusChange = async (title: string, status: TicketStatus) => {
		const res = await window.fetch(`${window.location.origin}/api/tickets/requests`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, status }),
		});
		const data = await res.json();

		if (!res.ok) {
			NotificationUtils.notify(data.error, 'ERROR');
			return;
		}

		NotificationUtils.notify(data.message);
		setTableChange(!tableChange);
	};

	useEffect(() => {
		getTickets();
	}, [page, tableChange, filter]);

	return (
		<>
			<Group>
				Filter by
				<SegmentedControl
					className={styles.control}
					data={['ALL', ...REQUEST_STATUS]}
					value={filter}
					onChange={setFilter}
					size="xs"
					radius="xl"
					color="cyan"
				/>
			</Group>
			<br />
			<Table horizontalSpacing="xl">
				<thead>
					<tr>
						<th style={{ color: '#fff' }}>Title</th>
						<th style={{ color: '#fff' }}>Description</th>
						<th style={{ color: '#fff' }}>Completed at</th>
						<th style={{ color: '#fff' }}>Status</th>
						{session?.user.isAdmin ? <th style={{ color: '#fff' }}>Mark request as</th> : ''}
					</tr>
				</thead>
				{rows.length > 0 ? <tbody>{rows}</tbody> : ''}
			</Table>
			{rows.length === 0 ? <Text className={styles.empty}>There is nothing here</Text> : ''}
			<br />
			<Pagination
				className={styles.pagination}
				classNames={{
					active: styles.active,
				}}
				page={page}
				onChange={handlePageChange}
				total={Math.ceil(totalItems / ITEMS_PER_PAGE)}
				withEdges
			/>
		</>
	);
};

export default RequestTable;
