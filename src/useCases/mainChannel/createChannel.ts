import { Guild, ChannelType } from "discord.js";

import GuildController from "@controllers/GuildController";
import { DatabaseLogger } from "@loggers/index";
import { fetchChannel } from "@useCases/mainChannel/fetchChannel";
import { createDefaultMessage } from "@utils/DefaultEmbed";

export async function createChannel(guild: Guild) {

	const fetchedChannelData = await fetchChannel(guild.id);

	if (fetchedChannelData) {
		DatabaseLogger.info(`${guild.name} already has a media channel`);

		if(fetchedChannelData.channel)
			await fetchedChannelData.channel.delete();
	}

	const channel = await guild.channels.create({
		name: "🎧┇twokei-music",
		type: ChannelType.GuildText,
		rateLimitPerUser: 3
	});

	const message = await channel.send(await createDefaultMessage(guild.id));

	await GuildController.save({
		id: guild.id,
		name: guild.name,
		media: {
			channel: channel.id,
			message: message.id,
		}
	});

	DatabaseLogger.info(`Created media channel for ${guild.name}, then saved it.`);
	
}