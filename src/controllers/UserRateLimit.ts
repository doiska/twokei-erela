import { Collection } from "discord.js";

export const MAX_RATE_LIMIT = 2;

class _UserRateLimit {

	private rateLimits: Collection<string, number>

	constructor() {
		this.rateLimits = new Collection();
	}

	public add(user: string, automatically = false, delay = 3000) {
		this.rateLimits.set(user, this.get(user) + 1);

		if(automatically)
			setTimeout(() => this.remove(user), delay);
	}

	public get(user: string) {
		return this.rateLimits.get(user) || 0;
	}

	public has(user: string) {
		return this.get(user) >= MAX_RATE_LIMIT;
	}

	public remove(user: string) {

		const current = this.get(user);

		if(current === 0) return;

		if(current === 1)
			return this.rateLimits.delete(user);

		return this.rateLimits.set(user, current - 1);
	}
}

export const UserRateLimit = new _UserRateLimit();
