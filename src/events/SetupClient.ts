import { Guild } from "discord.js";

import Twokei from "@client/Twokei";

import { CoreLogger } from "@loggers/index";
import { createChannel } from "@modules/mainChannel/createChannel";
import { registerEvent } from "@structures/EventHandler";

registerEvent("ready", async () => {
	Twokei.on("raw", (d) => Twokei.playerManager.updateVoiceState(d));

	if (Twokei.user?.id)
		CoreLogger.info(`Logged in as ${Twokei.user.tag}`);

	Twokei.emit('guildCreate', Twokei.guilds.cache.first() as Guild);
});

registerEvent("guildCreate", async (guild: Guild) => {
	await createChannel(guild);
});