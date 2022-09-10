import { MessageEditOptions } from "discord.js";

import { createDefaultMessage } from "@components/DefaultEmbed";
import { fetchChannel } from "@modules/mainChannel/fetchChannel";

export async function resetMediaMessage(guildId: string) {
	const channel = await fetchChannel(guildId);
	if (!channel?.message) throw new Error("No media message found");

	return channel.message.edit(await createDefaultMessage(guildId) as MessageEditOptions);
}