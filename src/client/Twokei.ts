import { Client, ClientOptions, Collection } from "discord.js";
import { Manager, Structure, Payload } from "erela.js";
import Spotify from "erela.js-spotify";

import { initializeDataSource } from "@client/XiaoDS";

import { mainConfig } from "@config/main";
import { CoreLogger } from "@loggers/index";
import ExtendedPlayer from "@structures/ExtendedPlayer";
import PlayerEmbed from "@structures/PlayerEmbed";
import walk from "@utils/Walk";

import { I18n } from "i18n";
import path from "path";

export class ExtendedClient extends Client {

	public playerManager: Manager;
	public translator: I18n;
	public embeds: Collection<string, PlayerEmbed> = new Collection();

	constructor(options?: ClientOptions) {
		super({
			intents: [
				"Guilds",
				"MessageContent",
				"GuildMessages",
				"GuildVoiceStates",
				"GuildMembers"
			],
			...options
		});

		Structure.extend("Player", () => ExtendedPlayer);

		const plugins = [];

		if(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
			plugins.push(new Spotify({
				clientID: process.env.SPOTIFY_CLIENT_ID,
				clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
				albumLimit: 1,
				playlistLimit: 1,
			}))
		}

		this.translator = new I18n();

		this.translator.configure({
			locales: ["en", "pt"],
			defaultLocale: "en",
			autoReload: true,
			directory: path.join(__dirname, "..", "locales"),
			syncFiles: true,
			logWarnFn: (msg: string) => CoreLogger.warn(msg),
			logErrorFn: (msg: string) => CoreLogger.error(msg),
		});

		this.playerManager = new Manager({
			nodes: mainConfig.lavalink.filter(n => n?.active ?? true),
			plugins: plugins,
			send(id: string, payload: Payload) {
				const guild = Twokei.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			}
		});

		process.on("unhandledRejection", (ex) => CoreLogger.error(ex));
		process.on("uncaughtException", (ex) => CoreLogger.error(ex));
	}

	public async initializeDS() {
		await initializeDataSource();
	}

	public async loadEvents() {
		walk(path.join(__dirname, "..", "events")).map(c => import(c));
	}
}

const Twokei = new ExtendedClient();
export default Twokei;