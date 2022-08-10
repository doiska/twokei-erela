import type { Locale } from "@typings/Locale";

import { Entity, Column, PrimaryColumn, ObjectIdColumn } from "typeorm";
import { UpdateDateColumn, CreateDateColumn } from "typeorm";

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
		dj_role?: string;

	@Column()
		language?: Locale;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
		created_at?: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
		updated_at?: Date;
}