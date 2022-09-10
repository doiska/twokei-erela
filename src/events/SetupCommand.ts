import { Message } from "discord.js";

import { createChannel } from "@modules/mainChannel/createChannel";
import { registerEvent } from "@structures/EventHandler";

// registerEvent("messageCreate", async (message: Message) => {
//
// 	if(!message.guild || message.author.bot || !message.member) return;
//
// 	const [command] = message.content.split(" ");
// 	if(command !== "2K!setup") return;
//
// 	if(!message.member.permissions.has("Administrator")) {
// 		await message.channel.send("Você não tem permissão para executar este comando.");
// 		return;
// 	}
//
// 	return createChannel(message.guild);
// });