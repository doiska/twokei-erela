import Twokei from "@client/Twokei";

import GuildController from "@controllers/GuildController";
import type { Locale } from "@typings/Locale";

export const translate = (key: string | string[], locale?: Locale | undefined): string[] => {

	if(typeof key === "string")
		return [Twokei.translator.__({ phrase: key, locale })];

	return key.map(k => Twokei.translator.__({ phrase: k, locale }));
}

export const translateGuild = async (key: string | string[], guild?: string) => {
	const locale = guild ? await GuildController.getGuildLocale(guild) : "en";
	return translate(key, locale);
}