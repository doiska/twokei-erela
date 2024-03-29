import Twokei from "@client/Twokei";

import { PlayerEventLogger } from "@loggers/index";
import { deferEmbedUpdate } from "@modules/playerEmbed/deferUpdate";
import { resetPlayerEmbed } from "@modules/playerEmbed/resetEmbed";
import { registerEvent } from "@structures/EventHandler";
import { UpdateType } from "@structures/ExtendedPlayer";


registerEvent("ready", () => {
	const playerManager = Twokei.playerManager;

	playerManager.on("nodeConnect", (node) =>
		PlayerEventLogger.info(`NODE CONNECT: ${node.options.host} ${node.options.port}`));

	playerManager.on("playerDestroy", async (player) => {
		PlayerEventLogger.info(`Queue ended for guild ${player.guild}`);
		await resetPlayerEmbed(player);
	})

	playerManager.on("trackAdd", async (player) => {
		await deferEmbedUpdate(player, { menu: true });
	})

	playerManager.on("trackStart", async (player) =>
		deferEmbedUpdate(player, { menu: true, button: true, embed: true }));

	playerManager.on("trackStuck", async (player, track, payload) =>
		PlayerEventLogger.error(`TRACK STUCK:`, { track, payload })
	)

	playerManager.on("trackError", (player, track, err) =>
		PlayerEventLogger.error(`TRACK ERROR:`, err, err)
	)

	playerManager.on("queueEnd", (player) => player.destroy());

	playerManager.on("queueUpdate", async (player, updateType) =>
		deferEmbedUpdate(player, { menu: updateType === UpdateType.SHUFFLE, button: true })
	);
});