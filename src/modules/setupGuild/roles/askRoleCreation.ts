import { ButtonBuilder, ButtonStyle, ButtonInteraction, GuildMember, ComponentType, Message } from "discord.js";


import { showRoleMenu } from "@modules/setupGuild/roles/showRoleMenu";
import { showRoleModal } from "@modules/setupGuild/roles/showRoleModal";
import { embed, builderToComponent } from "@utils/Discord";

export const askRoleCreation = async (message: Message) => {

	const roleEmbed = embed()
		.setAuthor({ name: 'Deseja selecionar algum cargo para gerenciar o canal?' })
		.addFields([
			{
				name: '📃 Selecionar existente:',
				value: 'Você poderá selecionar um cargo existente para o canal de música.',
			},
			{
				name: '🆕 Criar novo:',
				value: 'Será criado um novo cargo para o canal de música.',
			},
			{
				name: '❌ Ignorar:',
				value: 'Qualquer usuário poderá pular/parar músicas sem votação.',
			}
		]);

	const button = (text: string) => new ButtonBuilder().setLabel(text).setStyle(ButtonStyle.Primary);

	const selectRoleButton = button('Selecionar cargo existente').setCustomId('select-role');
	const createRoleButton = button('Criar cargo').setCustomId('create-role');
	const ignoreRoleButton = button('Ignorar').setCustomId('ignore-role').setStyle(ButtonStyle.Secondary);

	const buttons = builderToComponent([selectRoleButton, createRoleButton, ignoreRoleButton]);

	const useRoleMessage = await message.edit({ embeds: [roleEmbed], components: [buttons] });

	const filter = (i: ButtonInteraction) => {
		const isAdministrator = (i.member as GuildMember).permissions.has('Administrator');
		return isAdministrator && (i.customId === 'select-role' || i.customId === 'create-role' || i.customId === 'ignore-role');
	}

	const buttonInteraction = await useRoleMessage.awaitMessageComponent({ componentType: ComponentType.Button, filter, time: 60000 }).catch(() => undefined);

	if(!buttonInteraction || buttonInteraction.customId === 'ignore-role') {
		await useRoleMessage.delete()
		return;
	}

	if(buttonInteraction.customId === 'select-role')
		return showRoleMenu(buttonInteraction);

	else if(buttonInteraction.customId === 'create-role')
		return showRoleModal(buttonInteraction);

}