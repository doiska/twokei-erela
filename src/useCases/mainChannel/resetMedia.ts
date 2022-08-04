import { MessageEditOptions } from "discord.js";

import { fetchChannel } from "@useCases/mainChannel/fetchChannel";
import { createDefaultMessage } from "@utils/DefaultEmbed";

export async function resetMediaMessage(guildId: string) {
	const channel = await fetchChannel(guildId);
	if (!channel?.message) throw new Error("No media message found");

	return channel.message.edit(await createDefaultMessage(guildId) as MessageEditOptions);
}