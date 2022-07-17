import { Guild, ChannelType, ActionRowBuilder, Message } from "discord.js";

import Twokei from "@client/Twokei";

import { MessageActionRowComponentBuilder } from "@discordjs/builders";

export const getChannelById = (id: string, guild?: Guild) =>
	guild ? guild.channels.fetch(id) : Twokei.channels.fetch(id);

export const getMessageById = async (id: string, channelId: string): Promise<Message | undefined> => {
	const result = await getChannelById(channelId);

	if (!result || result.type !== ChannelType.GuildText) return;

	return result.messages.fetch(id);
};

export const parseBuilderToComponent = (builder: MessageActionRowComponentBuilder | MessageActionRowComponentBuilder[]) => {
	const components = Array.isArray(builder) ? builder : [builder];
	return new ActionRowBuilder<MessageActionRowComponentBuilder>().setComponents(...components);
};