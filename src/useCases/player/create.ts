import Twokei from "@client/Twokei";

export function create(guildId: string, textChannel: string, voiceChannelId: string) {
	return Twokei.playerManager.create({
		guild: guildId,
		textChannel: textChannel,
		voiceChannel: voiceChannelId,
		selfDeafen: true,
		emitFirstTrack: false
	});
}