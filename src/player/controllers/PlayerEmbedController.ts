import { Collection, ButtonBuilder, ButtonStyle, GuildTextBasedChannel } from "discord.js";
import { Player } from "erela.js";

import { createPrimaryButtons, createSecondaryButtons } from "@player/data/Buttons";
import { createPlayerMenu } from "@player/data/PlayerEmbedData";
import PlayerEmbed from "@structures/PlayerEmbed";
import { fetchChannel } from "@useCases/mainChannel/fetchChannel";
import { RowID } from "@utils/CustomId";

export type Updatable = {
	embed?: boolean;
	menu?: boolean;
	button?: boolean;
}

class _PlayerEmbedController {

	private embeds = new Collection<string, PlayerEmbed>();

	public async init(player: Player) {
		const fetched = await fetchChannel(player.guild);
		
		if(!fetched || !fetched.channel || !fetched.message)
			return;

		const { channel, message } = fetched;

		const deletable = (await channel.messages.fetch({ limit: 100 })).filter(m => m.id !== message.id);
		(message.channel as GuildTextBasedChannel).bulkDelete(deletable, true);
		
		this.embeds.set(player.guild, new PlayerEmbed(message, player));
	}

	public async reset(player: Player) {
		const currentEmbed = this.embeds.get(player.guild);

		if (!currentEmbed)
			return;

		await currentEmbed.reset();
		this.embeds.delete(player.guild);
	}

	public isPlaying(guildId: string) {
		return this.embeds.has(guildId);
	}

	public async deferUpdate(player: Player, {  embed, menu, button  }: Updatable) {
		const currentEmbed = this.embeds.get(player.guild);
		const queue = player.queue;

		if (!currentEmbed)
			return;

		if(!queue)
			return;

		if(embed) {
			currentEmbed.setEmbedData({
				title: `${queue.current?.title}` || "",
				url: queue.current?.uri || "",
			});
		}

		if (menu)
			currentEmbed.addComponent({
				rowId: RowID.PRIMARY_MENU,
				position: 0,
				components: createPlayerMenu(player)
			});

		if (button) {
			currentEmbed.addComponent({
				rowId: RowID.SECONDARY_MENU,
				position: 1,
				components: (await createPrimaryButtons(player)).map(b => new ButtonBuilder({ ...b, style: ButtonStyle.Secondary })),
			});

			currentEmbed.addComponent({
				rowId: RowID.THIRD_MENU,
				position: 2,
				components: (await createSecondaryButtons(player)).map(b => new ButtonBuilder({ ...b, style: ButtonStyle.Secondary })),
			})
		}

		return currentEmbed.deferUpdate();
	}
}

const PlayerEmbedController = new _PlayerEmbedController();

export { PlayerEmbedController };