import { Player } from "erela.js";

import Twokei from "@client/Twokei";

import PlayerEmbed from "@structures/PlayerEmbed";
import { fetchChannel } from "@useCases/mainChannel/fetchChannel";

export async function createPlayerEmbed(player: Player) {
	const { channel, message } = await fetchChannel(player.guild) || {};

	if (!channel || !message) {
		console.log(`No message or channel found.`)
		return;
	}

	const playerEmbed = new PlayerEmbed(message, player);
	Twokei.embeds.set(player.guild, playerEmbed);
	await playerEmbed.reset(false);
	console.log(`Embed successfully created and reseted.`)
	// const deletable = (await channel.messages.fetch({ limit: 100 })).filter(m => m.id !== message.id);
	// (message.channel as GuildTextBasedChannel).bulkDelete(deletable, true);
}