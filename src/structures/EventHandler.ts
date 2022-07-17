import { ClientEvents } from "discord.js";

import Twokei from "@client/Twokei";

export function registerEvent<T extends keyof ClientEvents>(eventName: T, handler: (...args: ClientEvents[T]) => void) {
	// console.log(`Registered event: ${eventName}`);
	Twokei.on(eventName, handler);
}