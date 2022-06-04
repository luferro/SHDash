import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Textarea, TextInput } from '@mantine/core';
import * as NotificationUtils from '../utils/notification';

const RequestForm = () => {
	const router = useRouter();

	const [state, setState] = useState({
		title: '',
		description: '',
	});

	const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.target;
		setState({ ...state, [name]: value });
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const res = await window.fetch(`${window.location.origin}/api/tickets/requests`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(state),
		});
		const data = await res.json();

		if (!res.ok) {
			NotificationUtils.notify(data.error, 'ERROR');
			return;
		}

		NotificationUtils.notify(data.message);
		router.reload();
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextInput
				name="title"
				placeholder="Which game server would you like to request?"
				label="Game server"
				value={state.title}
				onChange={handleChange}
				required
			/>
			<br />
			<Textarea
				name="description"
				placeholder="Describe how you'd like this game server to be"
				label="Description"
				value={state.description}
				onChange={handleChange}
				required
			/>
			<br />
			<Button type="submit" color="green" fullWidth>
				Submit
			</Button>
		</form>
	);
};

export default RequestForm;
