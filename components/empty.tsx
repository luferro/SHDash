import styles from '../styles/Home.module.css';
import { Text, Image } from '@mantine/core';

const Empty = () => {
	return (
		<div className={styles.empty}>
			<Text>There is nothing here</Text>
			<Image src="/svg/empty.svg" alt="Empty Icon" width={32} height={32} />
		</div>
	);
};

export default Empty;
