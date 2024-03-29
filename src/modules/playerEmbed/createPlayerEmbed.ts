import { GuildTextBasedChannel } from "discord.js";
import { Player } from "erela.js";

import Twokei from "@client/Twokei";

import { fetchChannel } from "@modules/mainChannel/fetchChannel";
import PlayerEmbed from "@structures/PlayerEmbed";

export async function createPlayerEmbed(player: Player) {
	const { channel, message } = await fetchChannel(player.guild) || {};

	if (!channel || !message) {
		console.log(`No message or channel found.`)
		return;
	}

	const playerEmbed = new PlayerEmbed(message, player);
	Twokei.embeds.set(player.guild, playerEmbed);
	await playerEmbed.reset(false);

	const deletable = (await channel.messages.fetch({ limit: 20 })).filter(m => m.id !== message.id);
	await (message.channel as GuildTextBasedChannel).bulkDelete(deletable, true);
}