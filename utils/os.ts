import { cpu, mem, os } from 'node-os-utils';

export const getResources = async () => {
	const cpuModel = cpu.model();
	const cpuUsage = await getCpuUsage();

	const { totalMemMb } = await mem.info();
	const ramUsage = await getRamUsage();

	return {
		cpu: {
			model: cpuModel,
			usage: cpuUsage,
		},
		ram: {
			total: Math.round(totalMemMb / 1024),
			usage: ramUsage,
		},
		uptime: os.uptime(),
	};
};

const getCpuUsage = async () => {
	const usage = await cpu.usage();
	return Math.round(usage);
};

const getRamUsage = async () => {
	const { freeMemPercentage } = await mem.info();
	return Math.round(100 - freeMemPercentage);
};
