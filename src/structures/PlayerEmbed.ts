import {
	Message,
	EmbedData,
	SelectMenuBuilder,
	ActionRowBuilder,
	ButtonBuilder, APIEmbed, APIButtonComponent
} from "discord.js";
import { Player } from "erela.js";

import { MessageActionRowComponentBuilder } from "@discordjs/builders";
import { Updatable } from "@player/controllers/PlayerEmbedController";
import { parseBuilderToComponent } from "@utils/Discord";
import { createEmbed, createMenu, createButtons } from "@utils/DefaultEmbed";

export type ButtonRow = {
	rowId: string;
	position: number;
	components: ButtonBuilder[];
}

export type MenuRow = {
	rowId: string;
	position: number;
	components: SelectMenuBuilder;
}

export default class PlayerEmbed {

	private readonly message: Message;

	private rows: (MenuRow | ButtonRow)[] = [];

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

	public addComponent(component: MenuRow | ButtonRow) {
		this.rows[component.position] = component;
	}

	public parseComponents(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
		const components = this.rows;

		components.sort((a, b) => a.position - b.position);
		return components.map(c => parseBuilderToComponent(c.components));
	}

	public async reset() {
		this.embed = await createEmbed(this.player.guild);
		this.rows = [await createMenu(this.player.guild), await createButtons(this.player.guild)];
		return this.deferUpdate();
	}

	public async deferUpdate() {
		return this.message.edit({
			embeds: [this.embed as APIEmbed],
			components: this.parseComponents()
		});
	}
}