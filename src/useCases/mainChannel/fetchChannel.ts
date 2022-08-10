import { TextChannel, Message, Guild } from "discord.js";

import Twokei from "@client/Twokei";

import { CoreLogger } from "@loggers/index";
import { Media } from "@models/Guild";
import { fetchGuild } from "@useCases/guildCreation/fetchGuild";
import { getChannelById } from "@utils/Discord";


type fetchChannelResponse = {
	message?: Message | undefined;
	channel?: TextChannel | undefined;
	media: Media
}

async function fetchChannel(resolvable: string | Guild, fetch = true): Promise<fetchChannelResponse | undefined> {

	const isId = typeof resolvable === 'string';
	const guildId = isId ? resolvable : resolvable.id;

	if(!guildId) return;

	const guildData = await fetchGuild(guildId);

	if(!guildData?.media) return;

	const { media: { channel: channelId, message: messageId } } = guildData;

	const result: fetchChannelResponse = { media: guildData.media }

	if(fetch) {
		if(channelId) {
			const guild = isId ? await Twokei.guilds.fetch(resolvable) : resolvable;
			const channel = await getChannelById(channelId, guild) as TextChannel;

			if(channel)
				result['channel'] = channel;

			if(channel && messageId)
				result['message'] = await channel.messages.fetch(messageId);
		}
	}

	CoreLogger.info(`Guild ${guildId} asked for a channel fetching.`)
	return result;
}

export { fetchChannel }