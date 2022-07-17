import GuildController from "@controllers/GuildController";

import { I18n } from "i18n";
import path from "path";
import { Locale } from "typings/Locale";

class Translator {
	private instance: I18n;

	constructor() {
		this.instance = new I18n();
		
		this.instance.configure({
			locales: ["pt", "en"],
			defaultLocale: "en",
			directory: path.join(__dirname, "../locales"),
		});
	}

	public translate(key: string, locale?: Locale | undefined): string  {
		return this.instance.__({ locale: locale ?? "en", phrase: key });
	}

	public massTranslate(keys: string[], locale?: Locale) {
		return keys.map(key => this.translate(key, locale));
	}

	public async translateGuild(key: string, guildId?: string) {
		const locale = guildId ? await GuildController.getGuildLocale(guildId) : "en";
		return this.translate(key, locale);
	}

	public async massTranslateGuild(keys: string[], guildId?: string) {
		const locale = guildId ? await GuildController.getGuildLocale(guildId) : "en";
		return keys.map(key => this.translate(key, locale));
	}
}

export default new Translator;