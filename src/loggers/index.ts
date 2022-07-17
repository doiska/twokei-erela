import { create, LogColors } from "./BaseLogger";

export const CoreLogger = create("CORE", LogColors.FgYellow);
export const PlayerLogger = create("PLAYER", LogColors.FgCyan);
export const PlayerEventLogger = create("PLAYER_EVENT", LogColors.FgCyan);
export const QueueLogger = create("QUEUE", LogColors.FgGreen);
export const CacheLogger = create("CACHE", LogColors.FgCyan);
export const DatabaseLogger = create("DATABASE", LogColors.FgMagenta);