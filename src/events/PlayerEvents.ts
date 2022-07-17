import Twokei from "@client/Twokei";

import { PlayerEventLogger } from "@loggers/index";
import PlayerEmbedController from "@player/controllers/PlayerEmbedController";
import { registerEvent } from "@structures/EventHandler";


registerEvent("ready", () => {
	const playerManager = Twokei.playerManager;

	playerManager.on("nodeConnect", (node) =>
		PlayerEventLogger.info(`NODE CONNECT: ${node.options.host} ${node.options.port}`)
	);

	playerManager.on("playerDestroy", async (player) => {
		PlayerEventLogger.info(`Queue ended for guild ${player.guild}`);
		await PlayerEmbedController.reset(player);
	})

	playerManager.on("trackAdd", async (player, track) => {
		PlayerEventLogger.info(`TRACK ADD:`, track);
		await PlayerEmbedController.deferUpdate(player, { menu: true });
	})

	playerManager.on("trackStart", async (player) =>
		await PlayerEmbedController.deferUpdate(player, { menu: true, button: true, embed: true })
	);

	playerManager.on("trackStuck", async (player, track, payload) =>
		PlayerEventLogger.error(`TRACK STUCK:`, { track, payload })
	)

	playerManager.on("trackError", (player, track, err) =>
		PlayerEventLogger.error(`TRACK ERROR:`, err, err)
	)

	playerManager.on("queueEnd", (player) => player.destroy())
});