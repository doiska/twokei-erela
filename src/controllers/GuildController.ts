import { dataSource } from "@client/DataSource";

import { DatabaseLogger } from "@loggers/index";
import { Guild } from "@models/Guild";

import _ from "lodash";

class GuildController {

	public async load(id: string) {
		const profiler = DatabaseLogger.startTimer();
		try {
			const res = await dataSource
				.getMongoRepository(Guild)
				.findOne({ where: { id }, cache: 60000 });

			DatabaseLogger.info(`Guild ${id} fetched.`);
			return res ?? undefined;
		} catch (e) {
			DatabaseLogger.info(`Guild ${id} failed!`, e);
		} finally {
			profiler.done({ message: `Guild ${id} finally fetched.` });
		}
	}

	public async get(id?: string) {
		if (!id) return;

		return this.load(id);
	}

	async updateLocale(id: string) {
		const newLocale = await this.getGuildLocale(id) === "en" ? "pt" : "en";
		return this.save({ id, language: newLocale });
	}

	public async getGuildLocale(id: string) {
		const guild = await this.get(id);
		return guild?.language ?? "en";
	}

	public async save(data: Partial<Guild>) {

		if (!data.id)
			throw new Error("Guild ID is required!");

		const current: Guild | undefined = await this.get(data.id);

		const merged = _.merge({ id: data.id }, current ?? {}, data);

		return await dataSource
			.getMongoRepository(Guild)
			.findOneAndUpdate(
				{ id: data.id },
				{ $set: merged },
				{ upsert: true }
			);
	}
}

export default new GuildController();