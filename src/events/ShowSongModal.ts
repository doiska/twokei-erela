import { Interaction, InteractionType, ChannelType, GuildMember } from "discord.js";

import Twokei from "@client/Twokei";

import { createSongModal } from "@modals/AddSongModal";
import { verifyChannel, ValidationResponse } from "@modules/mainChannel/verifyChannel";
import { play } from "@modules/player/play";
import { registerEvent } from "@structures/EventHandler";
import { BUTTON_ADD_SONG } from "@utils/CustomId";
import { fastEmbed } from "@utils/Discord";

registerEvent("interactionCreate", async (interaction: Interaction) => {

	if (interaction.type !== InteractionType.MessageComponent || !interaction.guild)
		return;

	if (interaction.customId !== BUTTON_ADD_SONG)
		return;

	const guildId = interaction.guild.id;
	const member = interaction.member as GuildMember;
	const channel = interaction.channel;

	if (!member || !channel || channel.type !== ChannelType.GuildText) {
		console.log("Member or channel not found");
		return;
	}

	const validation = await verifyChannel(channel);

	if (validation === ValidationResponse.INVALID_CHANNEL) {
		console.log("Invalid channel");
		return;
	}

	if (validation !== ValidationResponse.SUCCESS) {
		await interaction
			.reply({ ...fastEmbed('O canal não está configurado, use /setup ou clique com o direito no bot.'), ephemeral: true })
			.catch(() => {
				// ignore
			});
		return;
	}

	const voiceChannel = member.voice.channel;

	if (!voiceChannel || !Twokei.user) {
		await interaction.reply({ ...fastEmbed('Você precisa estar em um canal de voz.'), ephemeral: true });
		return;
	}

	if (!voiceChannel.permissionsFor(Twokei.user)?.has(["Connect", "Speak"]))
		return;

	await interaction.showModal(createSongModal());

	const modalSubmit = interaction.awaitModalSubmit({
		filter: (i) => i.user.id === member.id,
		time: 30000
	});

	modalSubmit.then(async (submission) => {
		const url = submission.fields.getTextInputValue('song-input');
		await submission.reply({ ...fastEmbed('Song added to queue'), ephemeral: true });
		await play(url, {
			guildId: guildId,
			channelId: channel.id,
			voiceChannelId: voiceChannel.id,
			member,
		});
	}).catch(async (e) => {
		console.error(e);
		await interaction.followUp({ ...fastEmbed('There was an error trying to play the song'), ephemeral: true });
	});
});