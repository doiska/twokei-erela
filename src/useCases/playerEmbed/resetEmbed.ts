import { Player } from "erela.js";

import Twokei from "@client/Twokei";

import { CoreLogger } from "@loggers/index";

export async function resetPlayerEmbed(player: Player) {
	const currentEmbed = Twokei.embeds.get(player.guild);

	if (!currentEmbed)
		return;

	CoreLogger.info(`Embed reset for ${player.guild} from resetEmbed.ts`);

	await currentEmbed.reset(true);
	Twokei.embeds.delete(player.guild);
}