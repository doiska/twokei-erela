import {
	Message,
	EmbedData,
	SelectMenuBuilder,
	ActionRowBuilder,
	ButtonBuilder, APIEmbed
} from "discord.js";
import { Player } from "erela.js";

import { MessageActionRowComponentBuilder } from "@discordjs/builders";
import { createEmbed, createMenu, createButtons } from "@utils/DefaultEmbed";
import { builderToComponent } from "@utils/Discord";

export type Row = {
	rowId: string;
	position: number;
	components: SelectMenuBuilder | ButtonBuilder[];
}

export default class PlayerEmbed {

	private readonly message: Message;

	private rows: Row[] = [];

	private embed: EmbedData = {};
	private player: Player;

	constructor(message: Message, player: Player) {
		this.message = message;
		this.player = player;

		this.reset();
	}

	public setEmbedData(embed?: EmbedData) {
		this.embed = {
			...this.embed,
			...embed
		};
	}

	public addComponent(component: Row) {
		this.rows[component.position] = component;
	}

	public async reset() {

		const [
			embed,
			menu,
			buttons
		] = await Promise.all([
			createEmbed(this.player.guild),
			createMenu(this.player.guild),
			createButtons(this.player.guild)
		]);

		this.embed = embed;
		this.rows = [menu, buttons];

		return this.deferUpdate();
	}

	public async deferUpdate() {
		const components = this.rows.map(row => builderToComponent(row.components));

		return this.message.edit({
			embeds: [this.embed as APIEmbed],
			components: components
		});
	}
}