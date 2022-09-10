import { InteractionType, ButtonInteraction, Interaction } from "discord.js";

import Twokei from "@client/Twokei";
import { InteractionLimitManager } from "@client/UserRateLimit";

import { isEmbedActive } from "@modules/playerEmbed/isEmbedActive";
import { registerEvent } from "@structures/EventHandler";
import { ButtonID } from "@utils/CustomId";
import { replyThenDelete } from "@utils/Discord";

registerEvent("interactionCreate", async (interaction: Interaction) => {

	if (interaction.type !== InteractionType.MessageComponent) return;

	const button = interaction as ButtonInteraction;

	if (!button.customId || !button.guild) return;

	if (!Object.values(ButtonID).includes(button.customId))
		return;

	const userInteractionLimit = InteractionLimitManager.acquire(`button-${interaction.user.id}`);

	if (userInteractionLimit.limited)
		return;

	userInteractionLimit.consume();

	if (!isEmbedActive(button.guild.id))
		return;

	const player = Twokei.playerManager.get(button.guild.id);

	if (!player) return;

	switch (button.customId) {
		case ButtonID.PREVIOUS: {
			player.previous();
			break;
		}
		case ButtonID.TOGGLE_PAUSE: {
			player.pause(!player.paused);
			break;
		}
		case ButtonID.NEXT: {
			player.skip();
			break;
		}
		case ButtonID.STOP: {
			player.destroy()
			player.queue.clear();
			break;
		}
		case ButtonID.SHUFFLE: {
			player.queue.shuffle();
			break;
		}
		case ButtonID.REPEAT: {
			player.toggleRepeat();
			break;
		}
	}

	replyThenDelete(button);
});