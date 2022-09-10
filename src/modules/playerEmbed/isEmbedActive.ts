import Twokei from "@client/Twokei";

export function isEmbedActive(guildId: string) {
	return Twokei.embeds.has(guildId);
}