import { ButtonInteraction, SelectMenuComponentOptionData, SelectMenuBuilder, ComponentType, SelectMenuInteraction } from "discord.js";

import { builderToComponent } from "@utils/Discord";

export const showRoleMenu = async (interaction: ButtonInteraction): Promise<string | undefined> => {

	if (!interaction.guild || !interaction.channel) return;

	const roles = await interaction.guild.roles.fetch();

	const options: SelectMenuComponentOptionData[] = roles.map(role => {
		return {
			label: role.name,
			value: role.id,
			description: role.id,
		};
	})

	const roleMenu = new SelectMenuBuilder()
		.setPlaceholder('Select role')
		.setOptions(options)
		.setMinValues(1)
		.setMaxValues(1)
		.setCustomId('role-menu');

	const collector = await interaction.channel.awaitMessageComponent({ componentType: ComponentType.SelectMenu, time: 60000 });

	return collector?.values[0];
}