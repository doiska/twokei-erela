import { Message, VoiceBasedChannel, Interaction } from "discord.js";


import Twokei from "@client/Twokei";

import { create } from "@modules/player/create";
import { createPlayerEmbed } from "@modules/playerEmbed/createPlayerEmbed";
import { isEmbedActive } from "@modules/playerEmbed/isEmbedActive";

export enum PlayerResponse {
	INVALID_FIELDS,
	NO_MATCHES,
	SUCCESS
}

export async function play(content: string, { guild, member, channel }: Message | Interaction, voiceChannel: VoiceBasedChannel) {
	if (!guild || !member || !channel) return PlayerResponse.INVALID_FIELDS;

	const channelId = channel.id;
	const { tracks, loadType } = await Twokei.playerManager.search({ query: content }, member);

	if (loadType === "NO_MATCHES" || loadType === "LOAD_FAILED")
		return PlayerResponse.NO_MATCHES;

	const player = await create(guild.id, channelId, voiceChannel.id);

	if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED")
		player.add(tracks[0]);
	else
		player.add(tracks);

	if(!isEmbedActive(guild.id))
		await createPlayerEmbed(player);

	if (!player.playing && !player.paused && !player.queue.size) {
		player.connect();
		await player.play();
	}

	return PlayerResponse.SUCCESS;
}