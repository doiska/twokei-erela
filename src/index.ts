import 'reflect-metadata';
import "dotenv/config";

import { CoreLogger } from "@loggers/index";

import Twokei from "./client/Twokei";

(async () => {

	CoreLogger.info("Starting Twokei...");
	await Twokei.initializeDS();

	CoreLogger.info("Xiao initialized.");

	await Twokei.loadEvents();

	CoreLogger.info("Events loaded.")
	await Twokei.login(process.env.TOKEN);

	Twokei.playerManager.init(Twokei.user?.id);
})();