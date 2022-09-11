import { Colors, SelectMenuBuilder, ButtonBuilder, ButtonStyle, MessageOptions, APIEmbed, EmbedData, InteractionButtonComponentData } from "discord.js";

import { translate } from "@client/Translator";

import { fetchGuild } from "@modules/guildCreation/fetchGuild";
import { Row } from "@structures/PlayerEmbed";
import { RowID, ButtonID, BUTTON_ADD_SONG, } from "@utils/CustomId";
import { builderToComponent } from "@utils/Discord";

const DEFAULT_MEDIA_IMAGE = 'https://cdn.discordapp.com/attachments/945719334402134016/970477237700812810/df661b213ee05573007418bcd5cca532.gif';

export const createEmbed = async (guildId?: string): Promise<EmbedData> => {

	const [title, footer, ...rest] = await translate([
		"EMBED_TITLE",
		"EMBED_FOOTER",
		"EMBED_HOW_TO_USE",
		"EMBED_HELP_DEV",
		"EMBED_NEW_FEATURES",
	], guildId);


	const guild = await fetchGuild(guildId);
	const image = guild?.media?.image ?? DEFAULT_MEDIA_IMAGE;

	return {
		title,
		description: rest.join(""),
		color: Colors.DarkButNotBlack,
		author: {
			name: "⚡ Created by doiská#0001",
			url: "https://twitter.com/two2kei",
		},
		image: {
			url: image,
		},
		footer: {
			text: footer,
			iconURL: "https://cdn.discordapp.com/attachments/945719334402134016/970477237700812810/df661b213ee05573007418bcd5cca532.gif",
		},
	};
};

export const createMenu = async (guildId?: string): Promise<Row> => {
	const [addSongText] = await translate("EMBED_ADD_SONG", guildId);

	return (
		new SelectMenuBuilder()
			.setMinValues(0)
			.setMaxValues(1)
			.setCustomId(RowID.SONG_MENU)
			.setPlaceholder(addSongText ?? "Add a song")
			.setDisabled(true)
			.setOptions([{
				label: addSongText ?? "Add a song",
				value: "addSong",
				default: true
			}])
	)
};

export const createButtons = async (guildId?: string): Promise<Row> => {

	//TODO: add playlist
	const [ADD_SONG, LOAD_PLAYLIST] = await translate(['BUTTON_EMBED_ADD_SONG', 'BUTTON_LOAD_PLAYLIST'], guildId);

	const buttons = [
		{
			customId: BUTTON_ADD_SONG,
			label: ADD_SONG ?? 'Add Song',
			style: ButtonStyle.Primary,
			emoji: "🎵",
		},
		{
			customId: ButtonID.LOAD_PLAYLIST,
			label: LOAD_PLAYLIST ?? 'Load Playlist',
			style: ButtonStyle.Primary,
			emoji: "📃",
			disabled: true,
		}
	] as InteractionButtonComponentData[]

	return buttons.map(button => new ButtonBuilder(button));
};

export const createSecondaryButtons = async (guildId?: string): Promise<Row> => {
	const [UPDATE_LOCALE, UPDATE_IMAGE] = await translate(['EMBED_LANGUAGE_SWITCH', 'BUTTON_IMAGE_EDITOR'], guildId);

	const buttons = [
		{
			customId: ButtonID.LANGUAGE_SWITCH,
			label: UPDATE_LOCALE,
			emoji: "🌐",
			style: ButtonStyle.Secondary,
		},
		{
			customId: ButtonID.EDIT_IMAGE,
			label: UPDATE_IMAGE,
			emoji: "🖼",
			style: ButtonStyle.Secondary,
		}
	] as InteractionButtonComponentData[]

	return buttons.map(button => new ButtonBuilder(button));
}

export const createDefaultEmbed = async (guildId?: string) => {

	const [buttons, secondary_buttons, menu, embed] = await Promise.all([
		createButtons(guildId),
		createSecondaryButtons(guildId),
		createMenu(guildId),
		createEmbed(guildId)
	]);

	return {
		embeds: [embed],
		components: [menu, buttons, secondary_buttons],
	};
};

export const createDefaultMessage = async (guildId?: string): Promise<MessageOptions> => {

	const beforeBuild = await createDefaultEmbed(guildId);
	const components = beforeBuild.components?.map(builderToComponent);

	return {
		embeds: beforeBuild.embeds as APIEmbed[],
		components,
	};
}