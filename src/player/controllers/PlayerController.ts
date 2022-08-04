import { Message, VoiceBasedChannel } from "discord.js";

import { translateGuild } from "@client/Translator";
import Twokei from "@client/Twokei";

import { PlayerLogger } from "@loggers/index";
import { PlayerEmbedController } from "@player/controllers/PlayerEmbedController";
import { sendTemporaryMessage, embed } from "@utils/Discord";

export async function play(content: string, message: Message, voiceChannel: VoiceBasedChannel) {

	if (!message.guild || !message.member) return;

	console.time(`search`)

	PlayerLogger.info(`Searching for ${content}`);

	const { tracks, loadType } = await Twokei.playerManager.search({ query: content }, message.member);

	console.timeEnd(`search`)

	PlayerLogger.info(`Search results: ${tracks.length}`, {});

	if (loadType === "NO_MATCHES" || loadType === "LOAD_FAILED") {
		const [notFoundMessage] = await translateGuild("NO_RESULTS_FOUND", message.guild.id);
		sendTemporaryMessage(message.channel, { embeds: [embed(notFoundMessage)] });
		return;
	}

	console.time(`play`)

	const player = Twokei.playerManager.create({
		guild: message.guild.id,
		textChannel: message.channel.id,
		voiceChannel: voiceChannel.id,
		selfDeafen: true,
	});

	if (loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED")
		player.add(tracks[0]);
	else
		player.add(tracks);

	if (!PlayerEmbedController.isPlaying(player.guild))
		await PlayerEmbedController.init(player);

	console.log(`Should be playing: ${!player.playing && !player.paused && !player.queue.size}`);

	if (!player.playing && !player.paused && !player.queue.size) {
		console.time('connect');
		player.connect();
		console.timeEnd("connect")

		await player.play();
	}

	console.timeEnd("play")
}