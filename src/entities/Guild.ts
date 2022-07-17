import { Entity, Column, PrimaryColumn } from "typeorm";
import { Locale } from "typings/Locale";

export type GuildData = {
	id: string;
	name?: string;
	media?: Media;
	language?: Locale;
}

export type Media = {
	channel: string;
	message: string;
}

@Entity()
export class Guild {
	
	@PrimaryColumn()
		id!: string;

	@Column()
		name!: string;

	@Column()
		media!: Media;

	@Column()
		language?: Locale;
}