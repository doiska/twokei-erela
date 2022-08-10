import { ButtonBuilder, ButtonStyle } from "discord.js";
import { Player } from "erela.js";

import Twokei from "@client/Twokei";

import { createPrimaryButtons, createSecondaryButtons } from "@components/Buttons";
import { createPlayerMenu } from "@components/SongMenu";
import { EmbedUpdatableFields } from "@typings/Player";


export async function deferEmbedUpdate(player: Player, { embed, menu, button }: EmbedUpdatableFields) {
	const currentEmbed = Twokei.embeds.get(player.guild);
	const queue = player.queue;

	console.log(`Updating embed for ${player.guild} with ${embed} ${menu} ${button} `);

	if (!currentEmbed)
		return;

	if (!queue)
		return;

	if (embed) {
		currentEmbed.setEmbedData({
			title: `${queue.current?.title}` || "",
			url: queue.current?.uri || "",
		});
	}

	if (menu)
		currentEmbed.addComponent(0, createPlayerMenu(player));

	if (button) {
		currentEmbed.addComponent(1, (await createPrimaryButtons(player)).map(b => new ButtonBuilder({ ...b, style: ButtonStyle.Secondary })));
		currentEmbed.addComponent(2, (await createSecondaryButtons(player)).map(b => new ButtonBuilder({ ...b, style: ButtonStyle.Secondary })))
	}

	return currentEmbed.deferUpdate();
}