import { APIEmbed, Colors, SelectMenuBuilder, ButtonBuilder, ButtonStyle, MessageOptions } from "discord.js";

import Translator from "@client/Translator";

import { MenuRow, ButtonRow } from "@structures/PlayerEmbed";
import { RowID, ButtonID } from "@utils/CustomId";
import { parseBuilderToComponent } from "@utils/Discord";

export const createEmbed = async (guildId?: string): Promise<APIEmbed> => {

	const [title, ...rest] = await Translator.massTranslateGuild([
		"EMBED_TITLE",
		"EMBED_HOW_TO_USE",
		"EMBED_HELP_DEV",
		"EMBED_NEW_FEATURES",
	], guildId);

	const footer = await Translator.translateGuild("EMBED_FOOTER", guildId);

	return {
		title,
		description: rest.join(""),
		color: Colors.DarkButNotBlack,
		author: {
			name: "⚡ Created by doiská#0001",
			url: "https://twitter.com/two2kei",
		},
		image: {
			url: "https://cdn.discordapp.com/attachments/945719334402134016/970477237700812810/df661b213ee05573007418bcd5cca532.gif",
		},
		footer: {
			text: footer,
		}
	};
};

export const createMenu = async (guildId?: string): Promise<MenuRow> => {
	const addSongText = await Translator.translateGuild("EMBED_ADD_SONG", guildId);

	return {
		rowId: RowID.PRIMARY_MENU,
		position: 0,
		components: new SelectMenuBuilder()
			.setMinValues(0)
			.setMaxValues(1)
			.setCustomId(RowID.PRIMARY_MENU)
			.setPlaceholder(addSongText)
			.setDisabled(true)
			.setOptions([{
				label: addSongText,
				value: "addSong",
				default: true
			}])
	};
};

export const createButtons = async (guildId?: string): Promise<ButtonRow> => {

	const [languageSwitch, loadPlaylist] = await Translator.massTranslateGuild([
		"EMBED_LANGUAGE_SWITCH", "BUTTON_LOAD_PLAYLIST"
	], guildId);

	return {
		rowId: RowID.SECONDARY_MENU,
		position: 1,
		components: [
			new ButtonBuilder()
				.setCustomId(ButtonID.LANGUAGE_SWITCH)
				.setStyle(ButtonStyle.Secondary)
				.setLabel(languageSwitch),
			new ButtonBuilder()
				.setCustomId("cid_load_playlist")
				.setStyle(ButtonStyle.Secondary)
				.setLabel(loadPlaylist),
		]
	};
};

export const createDefaultMessage = async (guildId?: string): Promise<MessageOptions> => {

	const { components: buttonBuilder } = await createButtons(guildId);
	const { components: menuBuilder } = await createMenu(guildId);

	const embed = await createEmbed(guildId);
	const buttons = parseBuilderToComponent(buttonBuilder);
	const menu = parseBuilderToComponent(menuBuilder);

	return {
		embeds: [embed],
		components: [menu, buttons],
	};
};