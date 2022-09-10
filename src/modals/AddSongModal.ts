import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js";

export const createSongModal = () => {

	const songInput = new TextInputBuilder()
		.setLabel('Song input')
		.setCustomId('song-input')
		.setStyle(TextInputStyle.Short)
		.setMinLength(3)
		.setMaxLength(400)
		.setPlaceholder('https://www.youtube.com/watch?v=dQw4w9WgXcQ')

	const row = new ActionRowBuilder<TextInputBuilder>().addComponents(songInput);

	return new ModalBuilder({ title: 'Twokei', components: [row], customId: 'add-song-modal' });
}