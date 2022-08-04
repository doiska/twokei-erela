import { Interaction, InteractionType, GuildMember } from "discord.js";

import { translateGuild } from "@client/Translator";

import GuildController from "@controllers/GuildController";
import { PlayerEmbedController } from "@player/controllers/PlayerEmbedController";
import { registerEvent } from "@structures/EventHandler";
import { resetMediaMessage } from "@useCases/mainChannel/resetMedia";
import { ButtonID } from "@utils/CustomId";
import { embed, fastEmbed } from "@utils/Discord";

registerEvent("interactionCreate", async (interaction: Interaction) => {

	if (interaction.type !== InteractionType.MessageComponent || !interaction.guild)
		return;

	if (interaction.customId !== ButtonID.LANGUAGE_SWITCH)
		return;

	if (PlayerEmbedController.isPlaying(interaction.guild.id))
		return;

	const author = interaction.member as GuildMember;

	if (!author)
		return;

	if (!author.permissions.has("Administrator")) {
		const [notEnoughPermissions] = await translateGuild(author.guild.id, "NO_PERMISSIONS");
		return interaction.reply({ embeds: [embed(notEnoughPermissions)] })
	}

	const [changingLanguage] = await translateGuild('CHANGING_LANGUAGE', interaction.guild.id);

	await interaction.reply({
		embeds: [embed(`${author.toString()}, ${changingLanguage}`)],
		ephemeral: true
	});

	await GuildController.updateLocale(author.guild.id);

	const [success, error] = await translateGuild(['SUCCESS_LANGUAGE_CHANGED', 'ERROR_LANGUAGE_CHANGED'], author.guild.id);

	resetMediaMessage(author.guild.id).then(() => {
		interaction.editReply(fastEmbed(`${author.toString()}, ${success}`));
	}).catch(() => {
		interaction.editReply(fastEmbed(`${author.toString()}, ${error}`));
	})
});