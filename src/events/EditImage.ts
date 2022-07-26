import { Interaction, InteractionType, ButtonInteraction, ModalSubmitInteraction, GuildMember, PermissionsBitField } from "discord.js";

import Translator from "@client/Translator";

import { ChannelController } from "@controllers/ChannelController";
import GuildController from "@controllers/GuildController";
import { registerEvent } from "@structures/EventHandler";
import { ButtonID } from "@utils/CustomId";

import { createImageModal } from "../modals/ImageModal";


registerEvent("interactionCreate", async (interaction: Interaction) => {

	if (interaction.type !== InteractionType.MessageComponent) return;

	const button = interaction as ButtonInteraction;

	if (!button.customId || !button.guild) return;

	if (button.customId !== ButtonID.EDIT_IMAGE) return;

	if(!(interaction.member as GuildMember).permissions.has('ManageMessages'))
		return;

	interaction.showModal(createImageModal());
});

registerEvent("interactionCreate", async (interaction: Interaction) => {
	if (interaction.type !== InteractionType.ModalSubmit) return;
	if (interaction.customId !== 'image-modal' || !interaction.guildId) return;

	const image = interaction.fields.getTextInputValue('image-input');

	if (!image)
		return;

	const message = await ChannelController.getMediaMessage(interaction.guildId);

	if (!message)
		return;

	const isImage = image.match(/\.(png|jpg|jpeg|gif)$/i);

	const [
		genericError,
		imageError,
		imageSuccess
	] = await Translator.massTranslateGuild(['GENERIC_ERROR', 'IMAGE_ERROR', 'IMAGE_UPDATED'], interaction.guildId)

	if (!isImage)
		return interaction.reply(imageError);

	GuildController.save({ id: interaction.guildId, media: { image } })
		.then(() => interaction.reply(imageSuccess))
		.catch(() => interaction.reply(genericError))
});