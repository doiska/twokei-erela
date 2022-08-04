import type { Locale } from "@typings/Locale";

import { Entity, Column, PrimaryColumn, ObjectIdColumn, DeleteDateColumn } from "typeorm";
import { UpdateDateColumn, CreateDateColumn } from "typeorm";

export type GuildData = {
	id: string;
	name?: string;
	media?: Media;
	language?: Locale;
	created_at?: Date;
	updated_at?: Date;
}

export type Media = {
	channel?: string;
	message?: string;
	image?: string;
}

@Entity()
export class Guild {

	@ObjectIdColumn()
		_id!: string;

	@PrimaryColumn()
		id!: string;

	@Column()
		name!: string;

	@Column()
		media!: Media;


	@Column()
		language?: Locale;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
		created_at?: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
		updated_at?: Date;
}