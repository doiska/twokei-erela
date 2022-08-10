import { Interaction, InteractionType, GuildMember } from "discord.js";

import { translate } from "@client/Translator";

import { ProfilerLogger } from "@loggers/index";
import { registerEvent } from "@structures/EventHandler";
import { fetchGuild } from "@useCases/guildCreation/fetchGuild";
import { saveGuild } from "@useCases/guildCreation/saveGuild";
import { resetMediaMessage } from "@useCases/mainChannel/resetMedia";
import { isEmbedActive } from "@useCases/playerEmbed/isEmbedActive";
import { ButtonID } from "@utils/CustomId";
import { embed, fastEmbed } from "@utils/Discord";

registerEvent("interactionCreate", async (interaction: Interaction) => {


	if (interaction.type !== InteractionType.MessageComponent || !interaction.guild)
		return;

	if (interaction.customId !== ButtonID.LANGUAGE_SWITCH)
		return;

	if (isEmbedActive(interaction.guild.id))
		return;

	const author = interaction.member as GuildMember;

	if (!author)
		return;

	if (!author.permissions.has("Administrator")) {
		const [notEnoughPermissions] = await translate(author.guild.id, "NO_PERMISSIONS");
		return interaction.reply({ embeds: [embed(notEnoughPermissions)] })
	}

	ProfilerLogger.profile(`language_switch_${interaction.id}`);

	const currentLocale = (await fetchGuild(interaction.guild.id))?.language ?? "en";

	await saveGuild({ id: interaction.guild.id, language: currentLocale === 'pt' ? 'en' : 'pt' })

	const [
		success,
		error,
		changingLanguage
	] = await translate([
		'SUCCESS_LANGUAGE_CHANGED',
		'ERROR_LANGUAGE_CHANGED',
		'CHANGING_LANGUAGE'
	], interaction.guild.id);

	ProfilerLogger.profile(`language_switch_${interaction.id}`);

	await interaction.reply({
		embeds: [embed(`${author.toString()}, ${changingLanguage}`)],
		ephemeral: true
	});

	resetMediaMessage(author.guild.id).then(() => {
		interaction.editReply(fastEmbed(`${author.toString()}, ${success}`));
	}).catch(() => {
		interaction.editReply(fastEmbed(`${author.toString()}, ${error}`));
	})

});