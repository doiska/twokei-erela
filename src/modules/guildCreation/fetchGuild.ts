import { XiaoDS } from "@client/XiaoDS";

import { Guild } from "@models/Guild";

export async function fetchGuild(guildId?: string) {

	if (!guildId) return;

	return XiaoDS.getRepository(Guild).findOne({ where: { id: guildId } });
}