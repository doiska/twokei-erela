import { Message, ChannelType } from "discord.js";

import Twokei from "@client/Twokei";

import { ChannelController, ValidationResponse } from "@controllers/ChannelController";
import { UserRateLimit } from "@controllers/UserRateLimit";
import { play } from "@player/controllers/PlayerController";
import { registerEvent } from "@structures/EventHandler";

registerEvent("messageCreate", async (message: Message) => {
	if (message.author.bot || !message.guild || !message.member || !message.content) return;

	if(message.channel.type !== ChannelType.GuildText) return;

	const voiceChannel = message.member.voice.channel;

	const validation = await ChannelController.validateChannel(message.channel);

	if(validation === ValidationResponse.INVALID_CHANNEL) return;

	if(validation !== ValidationResponse.SUCCESS) {
		message.reply("Não foi possível identificar o canal/mensagem de mídia, use 2!setup e tente novamente.").catch(() => {});
	}

	message.delete().catch(() => {
		// ignore
	});

	if(!voiceChannel) return;

	if(!Twokei.user) return;

	if(!voiceChannel.permissionsFor(Twokei.user)?.has(["Connect", "Speak"]))
		return;

	if(!UserRateLimit.has(message.member.id)) {
		await play(message.content, message, voiceChannel);
		return;
	}
});