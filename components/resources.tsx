import styles from '../styles/Home.module.css';
import { RingProgress, Text } from '@mantine/core';
import * as ConverterUtils from '../utils/converter';
import { ResourcesComponentProps } from '../types/props';

const Resources = ({ resources }: ResourcesComponentProps) => {
	return (
		<div className={`${styles.column} ${styles.single}`}>
			<div className={styles.topic}>
				<h2>Resources</h2>
			</div>
			<div className={styles.grid}>
				<div className={styles.card}>
					<div className={styles.top}>
						<div className={styles.specs}>
							<Text size="xl">
								<b>CPU:</b> {resources.cpu.model}
							</Text>
							<Text size="xl">
								<b>RAM:</b> {resources.ram.total} GB
							</Text>
							<Text size="xl">
								<b>Uptime:</b> {ConverterUtils.secondsToDays(resources.uptime)}
							</Text>
						</div>
						<div className={styles.resources}>
							<div>
								<Text size="lg" align="center">
									CPU
								</Text>
								<RingProgress
									size={200}
									thickness={20}
									label={
										<Text size="xl" align="center">
											{resources.cpu.usage} %
										</Text>
									}
									sections={[{ value: resources.cpu.usage, color: '#00adb5' }]}
								/>
							</div>
							<div>
								<Text size="lg" align="center">
									RAM
								</Text>
								<RingProgress
									size={200}
									thickness={20}
									label={
										<Text size="xl" align="center">
											{resources.ram.usage} %
										</Text>
									}
									sections={[{ value: resources.ram.usage, color: '#00adb5' }]}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Resources;
