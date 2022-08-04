import { Interaction, InteractionType, SelectMenuInteraction } from "discord.js";

import Twokei from "@client/Twokei";

import { PlayerLimitManager } from "@controllers/UserRateLimit";
import { PlayerEmbedController } from "@player/controllers/PlayerEmbedController";
import { registerEvent } from "@structures/EventHandler";
import { RowID } from "@utils/CustomId";

registerEvent("interactionCreate", async (interaction: Interaction) => {

	if(interaction.type !== InteractionType.MessageComponent || !interaction.guild || interaction.customId !== RowID.PRIMARY_MENU)
		return;

	const { values } = interaction as SelectMenuInteraction;

	if(!PlayerEmbedController.isPlaying(interaction.guild.id)) return;

	const player = Twokei.playerManager.get(interaction.guild.id);

	if(!player) return;

	const playerLimit = PlayerLimitManager.acquire(`menu-${player.guild}`);

	if(playerLimit.limited) return;

	if(values.length === 0) {
		player.pause(true);
	} else {
		player.pause(false);

		const [songId] = values;

		if(songId.startsWith("next-")) {
			try {
				const index = parseInt(songId.replace("next-", ""));

				if(index === -1) {
					player.previous();
				} else {
					player.skip(index);
				}
			} catch(e) {
				console.error(`Error skipping song: ${e}`);
			}
		}
	}

	playerLimit.consume();
	await interaction.deferReply().then(() => interaction.deleteReply());
});