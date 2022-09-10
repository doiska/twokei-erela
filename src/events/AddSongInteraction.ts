import { Interaction, InteractionType, ChannelType, GuildMember } from "discord.js";

import Twokei from "@client/Twokei";

import { createSongModal } from "@modals/AddSongModal";
import { verifyChannel, ValidationResponse } from "@modules/mainChannel/verifyChannel";
import { play, PlayerResponse } from "@modules/player/play";
import { registerEvent } from "@structures/EventHandler";
import { ButtonID } from "@utils/CustomId";
import { fastEmbed } from "@utils/Discord";

registerEvent("interactionCreate", async (interaction: Interaction) => {


	if (interaction.type !== InteractionType.MessageComponent || !interaction.guild)
		return;

	if (interaction.customId !== ButtonID.ADD_SONG)
		return;

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

	interaction.awaitModalSubmit({ filter: (i) => (i.user.id === interaction.user.id) && i.customId === 'add-song-modal', time: 60000 })
		.then(async (submission) => {
			const songInput = submission.fields.getTextInputValue('song-input');

			if (!songInput) {
				await submission.reply({ ...fastEmbed('Você não inseriu uma música.'), ephemeral: true });
				return;
			}

			play(songInput, interaction.message, voiceChannel).then((res) => {
				if (res === PlayerResponse.SUCCESS) {
					submission.reply({ ...fastEmbed('Adicionada com sucesso!'), ephemeral: true });
					return;
				}

				submission.reply({ ...fastEmbed('Ocorreu um erro, é possível que a música não esteja acessível.'), ephemeral: true });
			})
		})
		.catch(async (err) => {
			console.log(err);
			await interaction.reply({ ...fastEmbed('Tempo expirado.'), ephemeral: true });
		});
});