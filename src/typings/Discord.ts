import { ClientEvents } from "discord.js";

export type EventName = keyof ClientEvents | string;
export type EventList = ClientEvents;