import { XiaoDS } from "@client/XiaoDS";

import { Guild } from "@models/Guild";
import { fetchGuild } from "@modules/guildCreation/fetchGuild";

import _ from "lodash";

export async function saveGuild(guildData:  Partial<Guild>) {

	if(!guildData.id) return;

	const current = await fetchGuild(guildData.id);
	const merged = _.merge({ id: guildData.id }, current ?? {}, guildData);

	return XiaoDS.getRepository(Guild).save(merged);
}