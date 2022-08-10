import {
	Guild,
	ChannelType,
} from "discord.js";

import { createDefaultMessage } from "@components/DefaultEmbed";
import { DatabaseLogger } from "@loggers/index";
import { saveGuild } from "@useCases/guildCreation/saveGuild";
import { fetchChannel } from "@useCases/mainChannel/fetchChannel";
import { embed } from "@utils/Discord";

import { askRoleCreation } from "useCases/setupGuild/roles/askRoleCreation";

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
		rateLimitPerUser: 3
	});

	const setupMessage = await channel.send({ embeds: [embed(`Please setup the media channel for ${guild.name}.`)] });
	const roleSelection = await askRoleCreation(setupMessage).catch(e => {
		DatabaseLogger.error(e);
		return undefined;
	});

	console.log(`Selected role: ${roleSelection}`);

	if(setupMessage.deletable)
		setupMessage.delete();

	const message = await channel.send(await createDefaultMessage(guild.id));

	await saveGuild({
		id: guild.id,
		name: guild.name,
		dj_role: roleSelection,
		media: {
			channel: channel.id,
			message: message.id,
		}
	});

	DatabaseLogger.info(`Created media channel for ${guild.name}, then saved it.`);
}