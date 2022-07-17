import { Message, VoiceBasedChannel, EmbedBuilder, Colors } from "discord.js";

import Translator from "@client/Translator";
import Twokei from "@client/Twokei";

import { UserRateLimit } from "@controllers/UserRateLimit";
import { PlayerLogger } from "@loggers/index";
import PlayerEmbedController from "@player/controllers/PlayerEmbedController";

export async function play(content: string, message: Message, voiceChannel: VoiceBasedChannel) {

	if(!message.guild || !message.member) return;

	UserRateLimit.add(message.member.id);

	console.time(`search`)

	PlayerLogger.info(`Searching for ${content}`);

	const { tracks, loadType } = await Twokei.playerManager.search({ query: content }, message.member);

	console.timeEnd(`search`)

	PlayerLogger.info(`Search results: ${tracks.length}`, {  });

	if(loadType === "NO_MATCHES" || loadType === "LOAD_FAILED") {
		const notFoundMessage = await Translator.translateGuild("NO_RESULTS_FOUND", message.guild.id);

		message.channel.send({ embeds: [new EmbedBuilder().setDescription(notFoundMessage).setColor(Colors.DarkButNotBlack)] }).then((temp) => {
			setTimeout(() => {
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				temp.delete().catch(() => {});
			}, 3000)
		});

		UserRateLimit.remove(message.member.id);
		return;
	}

	console.time(`play`)

	const player = Twokei.playerManager.create({
		guild: message.guild.id,
		textChannel: message.channel.id,
		voiceChannel: voiceChannel.id,
		selfDeafen: true,
	});

	if(loadType === "SEARCH_RESULT" || loadType === "TRACK_LOADED")
		player.add(tracks[0]);
	else
		player.add(tracks);

	if(!PlayerEmbedController.isPlaying(player.guild))
		await PlayerEmbedController.init(player);

	console.log(`Should be playing: ${!player.playing && !player.paused && !player.queue.size}`);

	if(!player.playing && !player.paused && !player.queue.size) {

		console.time('connect');
		player.connect();
		console.timeEnd("connect")

		await player.play();
	}

	console.timeEnd("play")

	UserRateLimit.remove(message.member.id);
}