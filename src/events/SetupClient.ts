import { Guild } from "discord.js";

import Twokei from "@client/Twokei";

import { ChannelController } from "@controllers/ChannelController";
import { CoreLogger } from "@loggers/index";
import { registerEvent } from "@structures/EventHandler";

registerEvent("ready", async () => {
	Twokei.on("raw", (d) => Twokei.playerManager.updateVoiceState(d));

	if (Twokei.user?.id)
		CoreLogger.info(`Logged in as ${Twokei.user.tag}`);
});

registerEvent("guildCreate", async (guild: Guild) => {
	await ChannelController.createChannel(guild);
});