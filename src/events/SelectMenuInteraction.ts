import { Interaction } from "discord.js";

import Twokei from "@client/Twokei";

import PlayerEmbedController from "@player/controllers/PlayerEmbedController";
import { registerEvent } from "@structures/EventHandler";
import { RowID } from "@utils/CustomId";

registerEvent("interactionCreate", async (interaction: Interaction) => {

	if(!interaction.isSelectMenu() || !interaction.guild || interaction.customId !== RowID.PRIMARY_MENU)
		return;

	if(!PlayerEmbedController.isPlaying(interaction.guild.id)) return;

	const player = Twokei.playerManager.get(interaction.guild.id);

	if(!player) return;

	if(player.get('waiting')) return;

	player.set('waiting', true);

	if(interaction.values.length === 0) {
		player.pause(true);
	} else {
		player.pause(false);

		const [songId] = interaction.values;

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

	await interaction.deferReply();
	await interaction.deleteReply();

	player.set('waiting', false);
});