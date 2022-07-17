import { Guild } from "@entities/Guild";
import { User } from "@entities/User";

import { DataSource } from "typeorm";

export const dataSource = new DataSource({
	type: "mongodb",
	url: process.env.MONGODB_URI,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	ssl: true,
	logging: true,
	entities: [Guild, User],
	subscribers: [],
	migrations: [],
});

export const initializeDataSource = () => {
	return dataSource.initialize();
};