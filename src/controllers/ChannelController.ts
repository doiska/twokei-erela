import { ChannelType, Guild, TextChannel, Message, MessageEditOptions } from "discord.js";

import Twokei from "@client/Twokei";

import GuildController from "@controllers/GuildController";
import { Media } from "@entities/Guild";
import { DatabaseLogger } from "@loggers/index";
import { getChannelById, getMessageById } from "@utils/Discord";
import { createDefaultMessage } from "@utils/Embed";

export enum ValidationResponse {
	GENERIC_ERROR,
	INVALID_CHANNEL,
	CHANNEL_DOES_NOT_EXIST,
	MESSAGE_DOES_NOT_EXIST,
	SUCCESS
}

class _ChannelController {

	public async createChannel(guild: Guild) {

		const alreadyExists = await this.getMediaChannel(guild.id);

		if(alreadyExists) {
			DatabaseLogger.info(`${guild.name} already has a media channel`);
			await alreadyExists.delete();
		}

		const channel = await guild.channels.create({
			name: "🎧┇twokei-music",
			type: ChannelType.GuildText,
			rateLimitPerUser: 3
		});

		const message = await channel.send(await createDefaultMessage(guild.id));

		await GuildController.save({
			id: guild.id,
			name: guild.name,
			media: {
				channel: channel.id,
				message: message.id,
			}
		});

		DatabaseLogger.info(`Created media channel for ${guild.name}, then saved it.`);
	}

	public async validateChannel(channel: TextChannel): Promise<ValidationResponse> {
		const guild = await channel.guild;
		const media = await this.getMedia(guild.id);

		if(media?.channel !== channel.id)
			return ValidationResponse.INVALID_CHANNEL;

		if (!guild) return ValidationResponse.GENERIC_ERROR;

		if(!media) return ValidationResponse.CHANNEL_DOES_NOT_EXIST;

		if(!await this.getMediaMessage(guild.id))
			return ValidationResponse.MESSAGE_DOES_NOT_EXIST;

		return ValidationResponse.SUCCESS;
	}

	public async getMedia(guild: string): Promise<Media | undefined> {
		return (await GuildController.get(guild))?.media;
	}

	public async getMediaChannel(guildId: string): Promise<TextChannel | undefined> {
		const media = await this.getMedia(guildId);

		if (!media) return;

		const guild = await Twokei.guilds.fetch(guildId);

		return getChannelById(media.channel, guild).then(c => c as TextChannel).catch(() => undefined);
	}

	public async getMediaMessage(guild: string): Promise<Message | undefined> {
		const media = await this.getMedia(guild);

		if (!media) return;

		return getMessageById(media.message, media.channel).then(m => m).catch(() => undefined);
	}

	public async resetMediaMessage(guild: string): Promise<boolean> {
		const mediaMessage = await this.getMediaMessage(guild);

		if(!mediaMessage) return false;

		await mediaMessage.edit(await createDefaultMessage(guild) as MessageEditOptions);
		return true;
	}
}

export const ChannelController = new _ChannelController();