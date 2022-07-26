import { ButtonInteraction, Interaction } from "discord.js";
import { InteractionType } from 'discord.js';

import Twokei from "@client/Twokei";

import { UserRateLimit } from "@controllers/UserRateLimit";
import PlayerEmbedController from "@player/controllers/PlayerEmbedController";
import { registerEvent } from "@structures/EventHandler";
import { ButtonID } from "@utils/CustomId";


registerEvent("interactionCreate", async (interaction: Interaction) => {

	if (interaction.type !== InteractionType.MessageComponent) return;

	const button = interaction as ButtonInteraction;

	if (!button.customId || !button.guild) return;

	if (!Object.values(ButtonID).includes(button.customId))
		return;

	if (UserRateLimit.has(button.user.id))
		return;

	UserRateLimit.add(button.user.id, true);

	if (!PlayerEmbedController.isPlaying(button.guild.id))
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

	await interaction.deferReply()
	await interaction.deleteReply();
});