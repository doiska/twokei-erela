import { Message, ChannelType } from "discord.js";

import { ValidationResponse, verifyChannel } from "@modules/mainChannel/verifyChannel";
import { play,  } from "@modules/player/play";
import { registerEvent } from "@structures/EventHandler";

registerEvent("messageCreate", async (message: Message) => {
	if (message.author.bot || !message.guild || !message.member) return;

	if (message.channel.type !== ChannelType.GuildText) return;

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

	if(!message.content || !message.channel || !message.member.voice.channelId) return;

	await play(message.content, {
		guildId: message.guild.id,
		member: message.member,
		channelId: message.channel.id,
		voiceChannelId: message.member.voice.channelId,
	})
});