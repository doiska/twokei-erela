import { Interaction, InteractionType, SelectMenuInteraction } from "discord.js";

import Twokei from "@client/Twokei";
import { PlayerLimitManager } from "@client/UserRateLimit";

import { isEmbedActive } from "@modules/playerEmbed/isEmbedActive";
import { registerEvent } from "@structures/EventHandler";
import { RowID } from "@utils/CustomId";
import { replyThenDelete } from "@utils/Discord";

registerEvent("interactionCreate", async (interaction: Interaction) => {

	if(interaction.type !== InteractionType.MessageComponent || !interaction.guild || interaction.customId !== RowID.SONG_MENU)
		return;

	const { values } = interaction as SelectMenuInteraction;

	if(!isEmbedActive(interaction.guild.id)) return;

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
	replyThenDelete(interaction);
});