import { Message, ChannelType } from "discord.js";

import { translate } from "@client/Translator";
import Twokei from "@client/Twokei";

import { registerEvent } from "@structures/EventHandler";
import { ValidationResponse, verifyChannel } from "@useCases/mainChannel/verifyChannel";
import { play, PlayerResponse } from "@useCases/player/play";
import { sendTemporaryMessage, embed } from "@utils/Discord";

registerEvent("messageCreate", async (message: Message) => {
	if (message.author.bot || !message.guild || !message.member || !message.content) return;

	if (message.channel.type !== ChannelType.GuildText) return;

	const voiceChannel = message.member.voice.channel;

	const validation = await verifyChannel(message.channel);

	if (validation === ValidationResponse.INVALID_CHANNEL) return;

	if (validation !== ValidationResponse.SUCCESS) {
		await message
			.reply("Não foi possível identificar o canal/mensagem de mídia, use 2!setup e tente novamente.")
			.catch(() => {
			// ignore
			});
		return;
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	message.delete().catch(() => {});

	if (!voiceChannel || !Twokei.user) return;

	if (!voiceChannel.permissionsFor(Twokei.user)?.has(["Connect", "Speak"]))
		return;

	try {
		const response = await play(message.content, message, voiceChannel);

		if(response === PlayerResponse.NO_MATCHES) {
			const [notFoundMessage] = await translate("NO_RESULTS_FOUND", message.guild.id);
			await sendTemporaryMessage(message.channel, { embeds: [embed(notFoundMessage)] }, 10000);
		}
	} catch (error) {
		const [errorMessage] = await translate("PLAYER_ERROR", message.guild.id);
		await sendTemporaryMessage(message.channel, { embeds: [embed(errorMessage)] });
	}
});