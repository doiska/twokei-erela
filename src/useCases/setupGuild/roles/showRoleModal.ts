import { TextInputBuilder, TextInputStyle, ActionRowBuilder, ModalBuilder, ButtonInteraction } from "discord.js";

import { RoleLimits } from "@sapphire/discord-utilities";

export const showRoleModal = async (interaction: ButtonInteraction) => {
	const roleNameInput = new TextInputBuilder()
		.setLabel('DJ Role Name')
		.setCustomId('role-name-input')
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(RoleLimits.MaximumNameLength)
		.setValue('DJ 2K');

	const row = new ActionRowBuilder<TextInputBuilder>().addComponents(roleNameInput);

	const modal = new ModalBuilder({ title: 'Role name editor', components: [row], customId: 'role-name-modal' });

	await interaction.showModal(modal);

	const result = await interaction.awaitModalSubmit({ time: 60000, filter: () => true })
	return result.fields.getTextInputValue('role-name-input');
}