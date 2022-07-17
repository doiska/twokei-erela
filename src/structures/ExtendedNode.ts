import { Node, ModifyRequest } from "erela.js";

import { CoreLogger } from "@loggers/index";

export default class ExtendedNode extends Node {

	public async makeRequest<T>(endpoint: string, modify?: ModifyRequest): Promise<T> {

		CoreLogger.info(`Making request to ${this.options.host}:${this.options.port}/${endpoint}`);
		const res = await super.makeRequest<T>(endpoint, modify);

		if(!endpoint.includes("search"))
			CoreLogger.info(`Request to ${this.options.host}:${this.options.port}/${endpoint} completed`, res);

		return res;
	}
}