import {
	Guild,
	ChannelType,
	Message,
	MessageOptions,
	TextBasedChannel,
	EmbedData,
	EmbedBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ActionRowBuilder, InteractionReplyOptions, MessageComponentInteraction, ModalSubmitInteraction, NonThreadGuildBasedChannel
} from "discord.js";

import Twokei from "@client/Twokei";

import { MessageActionRowComponentBuilder } from "@discordjs/builders";


export const getChannelById = async (id: string, guild: Guild): Promise<TextBasedChannel | undefined> => {
	return guild.channels.fetch(id).then(c => c as TextBasedChannel).catch(() => undefined);
}

export const sendTemporaryMessage = (channel: TextBasedChannel, message: MessageOptions, timeout = 5000) => {
	channel.send(message).then(m => {
		setTimeout(() => {
			m.delete().catch(() => {
				// ignore
			});
		}, timeout)
	});
}

export const reply = (interaction: ModalSubmitInteraction | MessageComponentInteraction, reply: InteractionReplyOptions, timeout = 5000) => {
	interaction.reply(reply).then(() =>
		setTimeout(() => interaction.deleteReply(), timeout)
	)
}

export const builderToComponent = (builder: SelectMenuBuilder | ButtonBuilder | ButtonBuilder[]) => {
	const component = Array.isArray(builder) ? builder : [builder];
	return new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(...component);
}

export const embed = (embedOptions?: string | EmbedData) => {
	const embed = typeof embedOptions === "string" ? { description: embedOptions } : embedOptions;
	return new EmbedBuilder(embed)
}

export const fastEmbed = (embedOptions?: string | EmbedData) => {
	const builder = embed(embedOptions);
	return { embeds: [builder] }
}