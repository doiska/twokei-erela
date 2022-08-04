import { Guild } from "@models/Guild";
import { User } from "@models/User";

import { DataSource } from "typeorm";

export const dataSource = new DataSource({
	type: "mongodb",
	url: process.env.MONGODB_URI,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	ssl: true,
	logging: true,
	entities: [Guild, User],
	cache: {
		duration: 1000 * 60 * 60,
	},
	subscribers: [],
	migrations: [],
});

export const initializeDataSource = () => {
	return dataSource.initialize();
};