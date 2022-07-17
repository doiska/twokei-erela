import { NodeOptions } from "erela.js";

type ExtendedNodeOptions = NodeOptions & {
	active?: boolean;

}

type Config = {
	token: string | undefined;
	prefix: string;
	owners: string[];
	statuses: {
		text: string;
		type?: string;
		url?: string;
	}[],
	lavalink: ExtendedNodeOptions[];
}

export const mainConfig: Config = {
	token: process.env.DISCORD_TOKEN,
	prefix: "!",
	owners: ["226038466272690176"],
	statuses: [
		{
			text: "lofi-hiphop",
			type: "PLAYING"
		}
	],
	lavalink: [
		{
			identifier: "lavalink-free",
			host: "lava.link",
			port: 80,
			active: false,
			secure: true
		},
		{
			identifier: "freelavalink.ga",
			host: "connect.freelavalink.ga",
			port: 443,
			password: "www.freelavalink.ga",
			secure: true,
			active: false
		},
		{
			host: "node1.kartadharta.xyz",
			port: 443,
			password: "kdlavalink",
			secure: true
		},
		// {
		// 	host: "lavalink.kapes.eu",
		// 	port: 2222,
		// 	password: "lavalinkplay",
		// 	secure: false,
		// },
		// {
		// 	host: "lv.vellerius.tk",
		// 	port: 2333,
		// 	password: "derpilava",
		// 	secure: false,
		// },
		// {
		// 	host: "lavalink.rukchadisa.live",
		// 	port: 8080,
		// 	password: "youshallnotpass",
		// 	secure: false,
		// },
		// {
		// 	host: "audio.alexanderof.xyz",
		// 	port: 2000,
		// 	password: "lavalink",
		// 	secure: false
		// },
		// {
		// 	host: "lava-ny-01.thermalhosting.com",
		// 	port: 4018,
		// 	password: "thermalhosting.com",
		// 	secure: false
		// },
		// {
		// 	host: "54.37.6.86",
		// 	port: 80,
		// 	password: "Blacky#9125",
		// 	secure: false
		// }
	]
};