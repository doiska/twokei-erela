import Twokei from "@client/Twokei";

import { fetchGuild } from "@modules/guildCreation/fetchGuild";
import type { Locale } from "@typings/Locale";

const DEFAULT_LOCALE: Locale = 'en';

export const translate = async (keys: string | string[], guild?: string): Promise<string[]> => {
	const locale = (guild ? (await fetchGuild(guild))?.language : DEFAULT_LOCALE) ?? DEFAULT_LOCALE;
	const keyAsArray = Array.isArray(keys) ? keys : [keys];
	return keyAsArray.map(key => Twokei.translator.__({ phrase: key, locale }));
}