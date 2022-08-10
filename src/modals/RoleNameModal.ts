import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

import { RoleLimits } from "@sapphire/discord-utilities";

export const RoleNameModal = () => {

	const roleNameInput = new TextInputBuilder()
		.setLabel('DJ Role Name')
		.setCustomId('role-name-input')
		.setStyle(TextInputStyle.Short)
		.setMinLength(1)
		.setMaxLength(RoleLimits.MaximumNameLength)
		.setValue('DJ 2K');

	const row = new ActionRowBuilder<TextInputBuilder>().addComponents(roleNameInput);

	return new ModalBuilder({ title: 'Role name editor', components: [row], customId: 'role-name-modal' });
}