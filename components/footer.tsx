import styles from '../styles/Home.module.css';
import { Anchor, Image } from '@mantine/core';

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<Anchor href="https://github.com/luferro" target="_blank" rel="noopener noreferrer">
				<>
					Made by Luís Ferro&nbsp;
					<Image src="/svg/github.svg" alt="Github Icon" width={28} height={28} />
				</>
			</Anchor>
		</footer>
	);
};

export default Footer;
