import { Collection } from "discord.js";

import { dataSource } from "@client/DataSource";

import { Guild as GuildEX, GuildData } from "@entities/Guild";
import { CoreLogger, DatabaseLogger } from "@loggers/index";

class GuildController {

	private loading: string[] = [];
	private cache: Collection<string, GuildData> = new Collection<string, GuildData>();

	public async load(id: string) {
		if(this.loading.includes(id)) {
			DatabaseLogger.info(`Guild ${id} is already loading...`);
			return;
		}

		DatabaseLogger.info(`Loading guild ${id}...`);

		const target = this.loading.push(id);


		try {
			const res = await dataSource
				.getMongoRepository(GuildEX)
				.findOne({ where: { id } });

			if(res) {
				this.cache.set(id, res);
			}

			DatabaseLogger.info(`Guild ${id} loaded!`);
			return res;
		} catch(e) {
			DatabaseLogger.info(`Guild ${id} failed!`, e);
		} finally {
			this.loading.splice(target, 1);
		}
	}

	public async get(id: string) {

		if(this.cache.get(id))
			return this.cache.get(id);

		return this.load(id);
	}

	public syncGet(id: string) {

		if(!this.cache.get(id)) {
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

		if(guild)
			return guild.language;

		return "en";
	}

	public async save(data: Partial<GuildData>) {

		if(!data.id) return;

		const current = await this.get(data.id) || {};

		this.cache.set(data.id, {
			id: data.id,
			...current,
			...data
		});

		return dataSource
			.getMongoRepository(GuildEX)
			.findOneAndUpdate(
				{ id: data.id },
				{ $set : data },
				{ upsert: true }
			);
	}

}

export default new GuildController();