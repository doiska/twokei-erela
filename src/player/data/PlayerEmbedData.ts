import { SelectMenuBuilder } from "discord.js";
import { Player } from "erela.js";

import { RowID } from "@utils/CustomId";

export function createPlayerMenu(player: Player) {

	const { previous, current } = player.queue;

	const emojis = ['⏪', '🎶',  '⏩'];

	const songs = [previous, current, ...player.queue].slice(0, 24);

	return new SelectMenuBuilder({
		customId: RowID.PRIMARY_MENU,
		minValues: 1,
		maxValues: 1,
		options: songs.filter(Boolean).map((song, index) => ({
			label: song?.title ?? song?.uri ?? "Unknown",
			value: `next-${previous ? index-1 : index}`,
			emoji: previous ? emojis[index] : emojis[index+1],
			default: song === player.queue.current,
		}))
	});
}