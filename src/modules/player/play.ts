import { Message, VoiceBasedChannel, Interaction, GuildMember } from "discord.js";


import Twokei from "@client/Twokei";

import { create } from "@modules/player/create";
import { createPlayerEmbed } from "@modules/playerEmbed/createPlayerEmbed";
import { isEmbedActive } from "@modules/playerEmbed/isEmbedActive";

export enum PlayerResponse {
	INVALID_FIELDS,
	NO_MATCHES,
	SUCCESS
}

type Props = {
	guildId: string;
	member: GuildMember,
	channelId: string;
	voiceChannelId: string,
}

export async function play(content: string, { guildId, member, channelId, voiceChannelId }: Props) {
	if (!guildId || !member || !channelId) return PlayerResponse.INVALID_FIELDS;

	const { tracks, loadType } = await Twokei.playerManager.search({ query: content }, member);

	if (loadType === "NO_MATCHES" || loadType === "LOAD_FAILED")
		return PlayerResponse.NO_MATCHES;

	const player = create(guildId, channelId, voiceChannelId);

	if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED")
		player.add(tracks[0]);
	else
		player.add(tracks);

	if(!isEmbedActive(guildId))
		await createPlayerEmbed(player);

	if (!player.playing && !player.paused && !player.queue.size) {
		player.connect();
		await player.play();
	}

	return PlayerResponse.SUCCESS;
}