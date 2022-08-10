import { RateLimitManager } from "@sapphire/ratelimits";

export const PlayerLimitManager = new RateLimitManager(3000);
export const InteractionLimitManager = new RateLimitManager(2000, 2);