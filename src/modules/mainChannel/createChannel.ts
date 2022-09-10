import {
	Guild,
	ChannelType,
} from "discord.js";

import { createDefaultMessage } from "@components/DefaultEmbed";
import { DatabaseLogger, CoreLogger } from "@loggers/index";
import { saveGuild } from "@modules/guildCreation/saveGuild";
import { fetchChannel } from "@modules/mainChannel/fetchChannel";
import { askRoleCreation } from "@modules/setupGuild/roles/askRoleCreation";
import { embed } from "@utils/Discord";


export async function createChannel(guild: Guild) {

	const fetchedChannelData = await fetchChannel(guild.id);

	if (fetchedChannelData) {
		DatabaseLogger.info(`${guild.name} already has a media channel`);

		if (fetchedChannelData.channel)
			await fetchedChannelData.channel.delete();
	}

	const channel = await guild.channels.create({
		name: "🎧┇twokei-music",
		type: ChannelType.GuildText,
		permissionOverwrites: [
			{
				id: guild.roles.everyone,
				deny: ["SendMessages"]
			}
		]
	});

	CoreLogger.info(`Created media channel for ${guild.name}2`);

	const message = await channel.send(await createDefaultMessage(guild.id));

	CoreLogger.info(`Created media channel for ${guild.name}`);

	await saveGuild({
		id: guild.id,
		name: guild.name,
		media: {
			channel: channel.id,
			message: message.id,
		}
	});

	DatabaseLogger.info(`Created media channel for ${guild.name}, then saved it.`);
}