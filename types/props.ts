interface Resources {
	resources: {
		cpu: {
			model: string;
			usage: number;
		};
		ram: {
			total: number;
			usage: number;
		};
		uptime: number;
	};
}

interface Containers {
	containers: {
		id: string;
		name: string;
		state: 'ONLINE' | 'OFFLINE';
		status: string;
		address: string;
	}[];
}

interface Filter {
	filter: 'ONLINE' | 'OFFLINE';
}

export type ResourcesComponentProps = Resources;
export type ServersComponentProps = Containers & ResourcesComponentProps & Filter;
export type ServerSideRenderProps = Containers & ResourcesComponentProps;
