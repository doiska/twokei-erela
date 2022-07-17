import "dotenv/config";
import "./client/Twokei";
import Twokei from "@client/Twokei";


(async () => {
	await Twokei.initializeDS();
	await Twokei.loadEvents();
	await Twokei.login(process.env.TOKEN);

	Twokei.playerManager.init(Twokei.user?.id).init(Twokei.user?.id);
})();