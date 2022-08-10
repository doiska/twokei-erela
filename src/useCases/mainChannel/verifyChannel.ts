import { TextChannel } from "discord.js";


import { fetchChannel } from "@useCases/mainChannel/fetchChannel";

export enum ValidationResponse {
	GENERIC_ERROR,
	INVALID_CHANNEL,
	CHANNEL_DOES_NOT_EXIST,
	MESSAGE_DOES_NOT_EXIST,
	SUCCESS
}


export async function verifyChannel({ id, guild, messages }: TextChannel): Promise<ValidationResponse> {

	if (!guild) return ValidationResponse.GENERIC_ERROR;

	const fetched = await fetchChannel(guild.id, false);

	if (!fetched?.media.channel) return ValidationResponse.INVALID_CHANNEL;

	if (fetched.media.channel !== id)
		return ValidationResponse.INVALID_CHANNEL;

	if (!fetched.media.message)
		return ValidationResponse.MESSAGE_DOES_NOT_EXIST;

	const doesMessageExists = await messages.fetch(fetched.media.message);

	if (!doesMessageExists)
		return ValidationResponse.MESSAGE_DOES_NOT_EXIST;

	return ValidationResponse.SUCCESS;
}