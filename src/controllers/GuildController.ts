import { Collection } from "discord.js";

import { dataSource } from "@client/DataSource";

import { Guild as GuildEX, GuildData } from "@entities/Guild";
import { DatabaseLogger } from "@loggers/index";
import _ from "lodash";

class GuildController {

	private loading: string[] = [];
	private cache: Collection<string, GuildData> = new Collection<string, GuildData>();

	public async load(id: string) {
		if (this.loading.includes(id)) {
			DatabaseLogger.info(`Guild ${id} is already loading...`);
			return;
		}

		DatabaseLogger.info(`Loading guild ${id}...`);

		const target = this.loading.push(id);


		try {
			const res = await dataSource
				.getMongoRepository(GuildEX)
				.findOne({ where: { id } });

			if (res) {
				this.cache.set(id, res);
			}

			DatabaseLogger.info(`Guild ${id} loaded!`);
			return res ?? undefined;
		} catch (e) {
			DatabaseLogger.info(`Guild ${id} failed!`, e);
		} finally {
			this.loading.splice(target, 1);
		}
	}

	public async get(id: string) {

		if (this.cache.get(id))
			return this.cache.get(id);

		return this.load(id);
	}

	public syncGet(id: string) {

		if (!this.cache.get(id)) {
			this.load(id);
		}

		return this.cache.get(id);
	}

	async updateLocale(id: string) {
		const newLocale = await this.getGuildLocale(id) === "en" ? "pt" : "en";
		return this.save({ id, language: newLocale });
	}


	public async getGuildLocale(id: string) {
		const guild = await this.get(id);

		if (guild)
			return guild.language;

		return "en";
	}

	public async save(data: Partial<GuildData>) {

		if (!data.id)
			throw new Error("Guild ID is required!");

		const current: GuildData | undefined = await this.get(data.id);

		const merged = _.merge({ id: data.id }, current ?? {}, data);

		this.cache.set(data.id, merged);

		// const flat = flattenKeys(data);

		return await dataSource
			.getMongoRepository(GuildEX)
			.findOneAndUpdate(
				{ id: data.id },
				{ $set: merged },
				{ upsert: true }
			);
	}
}

export default new GuildController();