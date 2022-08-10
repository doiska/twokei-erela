import { Interaction, InteractionType, ButtonInteraction, GuildMember } from "discord.js";

import { translate } from "@client/Translator";

import { registerEvent } from "@structures/EventHandler";
import { saveGuild } from "@useCases/guildCreation/saveGuild";
import { fetchChannel } from "@useCases/mainChannel/fetchChannel";
import { resetMediaMessage } from "@useCases/mainChannel/resetMedia";
import { ButtonID } from "@utils/CustomId";
import { embed, fastEmbed, reply } from "@utils/Discord";

import { createImageModal } from "../modals/ImageModal";


registerEvent("interactionCreate", async (interaction: Interaction) => {

	if (interaction.type !== InteractionType.MessageComponent) return;

	const button = interaction as ButtonInteraction;

	if (!button.customId || !button.guild) return;

	if (button.customId !== ButtonID.EDIT_IMAGE) return;

	const author = button.member as GuildMember;

	if (!author.permissions.has("ManageMessages")) {
		const [notEnoughPermissions] = await translate(author.guild.id, "NO_PERMISSIONS");
		return interaction.reply({ embeds: [embed(notEnoughPermissions)] })
	}

	interaction.showModal(createImageModal());
});

registerEvent("interactionCreate", async (interaction: Interaction) => {
	if (interaction.type !== InteractionType.ModalSubmit) return;
	if (interaction.customId !== 'image-modal' || !interaction.guildId) return;
	if (!interaction.guildId || !interaction.guild) return;

	const image = interaction.fields.getTextInputValue('image-input');

	if (!image)
		return;

	const response = await fetchChannel(interaction.guildId);

	if (!response)
		return;

	const isImage = image.match(/\.(png|jpg|jpeg|gif)$/i);

	const [
		genericError,
		imageError,
		imageSuccess
	] = await translate(['GENERIC_ERROR', 'IMAGE_ERROR', 'IMAGE_UPDATED'], interaction.guildId)

	if (!isImage)
		return reply(interaction, fastEmbed(imageError));

	await saveGuild({ id: interaction.guildId, media: { image } })
		.then(async () => reply(interaction, fastEmbed(imageSuccess)))
		.catch(() => reply(interaction, fastEmbed(genericError)));

	await resetMediaMessage(interaction.guildId);
});