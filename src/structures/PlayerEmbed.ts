import {
	Message,
	EmbedData,
	SelectMenuBuilder,
	ButtonBuilder, APIEmbed
} from "discord.js";
import { Player } from "erela.js";

import { createDefaultEmbed } from "@components/DefaultEmbed";
import { CoreLogger } from "@loggers/index";
import { builderToComponent } from "@utils/Discord";

export type Row = SelectMenuBuilder | ButtonBuilder[];

export default class PlayerEmbed {

	private readonly message: Message;

	private rows: Row[] = [];

	private embed: EmbedData = {};
	private player: Player;

	constructor(message: Message, player: Player) {
		this.message = message;
		this.player = player;
	}

	public setEmbedData(embed?: EmbedData) {
		this.embed = {
			...this.embed,
			...embed
		};
	}

	public addComponent(position: number, component: Row) {
		this.rows[position] = component;
	}

	public async reset(shouldUpdate = false) {

		CoreLogger.info(`Embed reset for ${this.player.guild} from PlayerEmbed.ts`);

		const guildId = this.player.guild;

		const { embeds: [embed], components: rows } = await createDefaultEmbed(guildId);

		this.embed = embed;
		this.rows = rows;

		if(shouldUpdate)
			return this.deferUpdate();
	}

	public async deferUpdate() {
		const components = this.rows.map((row) => builderToComponent(row));

		return this.message.edit({
			embeds: [this.embed as APIEmbed],
			components: [...components]
		});
	}
}