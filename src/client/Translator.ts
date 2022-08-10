import Twokei from "@client/Twokei";

import type { Locale } from "@typings/Locale";
import { fetchGuild } from "@useCases/guildCreation/fetchGuild";

const DEFAULT_LOCALE: Locale = 'en';

export const translate = async (key: string | string[], guild?: string) => {

	const { language: locale } = await fetchGuild(guild) || { language: DEFAULT_LOCALE };

	if (typeof key === "string")
		return [Twokei.translator.__({ phrase: key, locale })];

	return key.map(k => Twokei.translator.__({ phrase: k, locale }));
}