import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

export const createImageModal = () => {

	const imageInput = new TextInputBuilder()
		.setLabel('Image URL (png, gif, jpg)')
		.setCustomId('image-input')
		.setStyle(TextInputStyle.Short)
		.setMinLength(10)
		.setMaxLength(400)
		.setPlaceholder('https://example.com/image.png')

	const row = new ActionRowBuilder<TextInputBuilder>().addComponents(imageInput);

	return new ModalBuilder({ title: 'Image editor', components: [row], customId: 'image-modal' });
}