import {
	Guild,
	MessageOptions,
	TextBasedChannel,
	EmbedData,
	EmbedBuilder,
	SelectMenuBuilder,
	ButtonBuilder,
	ActionRowBuilder, InteractionReplyOptions, MessageComponentInteraction, ModalSubmitInteraction, Interaction, CommandInteraction
} from "discord.js";

import { MessageActionRowComponentBuilder } from "@discordjs/builders";
import { CoreLogger } from "@loggers/index";


export const getChannelById = async (id: string, guild: Guild): Promise<TextBasedChannel | undefined> => {
	return guild.channels.fetch(id).then(c => c as TextBasedChannel).catch(() => undefined);
}

export const sendTemporaryMessage = async (channel: TextBasedChannel, messageContent: MessageOptions, timeout = 5000) => {

	const message = await channel.send(messageContent);

	setTimeout(() => message.delete(), timeout);

	return message;
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

export const replyThenDelete = (interaction: MessageComponentInteraction | ModalSubmitInteraction) => {

	if(!interaction.isRepliable()) return;

	interaction.deferReply().then(() => interaction.deleteReply()).catch(() => CoreLogger.error("Failed to delete reply \"replyThenDelete\"."));
}