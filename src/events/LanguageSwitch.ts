import { Interaction } from "discord.js";

import { ChannelController } from "@controllers/ChannelController";
import GuildController from "@controllers/GuildController";
import PlayerEmbedController from "@player/controllers/PlayerEmbedController";
import { registerEvent } from "@structures/EventHandler";
import { ButtonID } from "@utils/CustomId";

registerEvent("interactionCreate", async (interaction: Interaction) => {

	if(!interaction.isButton() || !interaction.guild)
		return;

	if(interaction.customId !== ButtonID.LANGUAGE_SWITCH)
		return;
	if(PlayerEmbedController.isPlaying(interaction.guild.id))
		return;

	const author = interaction.message.member;

	if(!author)
		return;

	if(!author.permissions.has("Administrator")) {
		return interaction.reply({ephemeral: true, content: "You do not have permission to use this command"});
	}

	await GuildController.updateLocale(author.guild.id);
	await ChannelController.resetMediaMessage(author.guild.id);

	await interaction.reply({ ephemeral: true, content: "Language updated!" });
});