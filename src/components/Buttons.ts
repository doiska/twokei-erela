import { APIButtonComponent, APIMessageComponentEmoji } from "discord.js";
import { Player } from "erela.js";

import { translate } from "@client/Translator";

import { ButtonID } from "@utils/CustomId";

type Button = Omit<APIButtonComponent, "style" | "type"> & {
	custom_id: string;
	emoji: string | APIMessageComponentEmoji;
};

export const createPrimaryButtons = async (player: Player): Promise<Button[]> => {

	const [STOP_BUTTON, REWIND_BUTTON, RESUME_BUTTON, PAUSE_BUTTON, NEXT_BUTTON] = await translate([
		"BUTTON_STOP",
		"BUTTON_PREVIOUS",
		"BUTTON_RESUME",
		"BUTTON_PAUSE",
		"BUTTON_NEXT",
	], player.guild);

	return [
		{
			custom_id: ButtonID.STOP,
			label: STOP_BUTTON,
			emoji: "⏹",
		},
		{
			custom_id: ButtonID.PREVIOUS,
			label: REWIND_BUTTON,
			emoji: "⏪",
		},
		{
			custom_id: ButtonID.TOGGLE_PAUSE,
			label: player.paused ? RESUME_BUTTON : PAUSE_BUTTON,
			emoji: "⏯",
		},
		{
			custom_id: ButtonID.NEXT,
			label: NEXT_BUTTON,
			emoji: "⏭",
		}
	];
};

export const createSecondaryButtons = async (player: Player): Promise<Button[]> => {
	const [BUTTON_REPEAT, BUTTON_SHUFFLE] = await translate([
		"BUTTON_REPEAT",
		"BUTTON_SHUFFLE",
		"BUTTON_AUTO_PLAY"
	], player.guild);

	return [
		{
			custom_id: ButtonID.SHUFFLE,
			label: BUTTON_SHUFFLE,
			emoji: "🔀",
		},
		{
			custom_id: ButtonID.REPEAT,
			label: BUTTON_REPEAT,
			emoji: "🔁",
		},
	];
}