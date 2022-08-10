import { Player } from "erela.js";
import { Track, UnresolvedTrack } from "erela.js/structures/Player";

export enum UpdateType {
	PAUSE,
	RESUME,
	SHUFFLE,
	REPEAT
}

declare module "erela.js/structures/Manager" {
	interface Manager {
		on(event: "trackAdd", listener: (player: Player, track: Track | UnresolvedTrack, offset?: number) => void): this;

		on(event: "queueUpdate", listener: (player: Player, type: UpdateType) => void): this;
	}
}

declare module "erela.js/structures/Player" {
	interface PlayerOptions {
		emitFirstTrack: boolean;
	}

	interface Player {
		add(track: (Track | UnresolvedTrack) | (Track | UnresolvedTrack)[], offset?: number): void;

		skip(amount?: number): void;

		previous(): void;

		toggleRepeat(): void;
	}
}

export default class ExtendedPlayer extends Player {


	public add(track: (Track | UnresolvedTrack) | (Track | UnresolvedTrack)[], offset?: number) {

		const isFirstTrack = this.queue.length === 0 && !this.queue.current;

		this.queue.add(track, offset);

		if(isFirstTrack && !this.options.emitFirstTrack)
			return;

		this.manager.emit('trackAdd', this, track, offset);
	}

	public skip(amount?: number) {
		super.stop(amount);
	}

	public previous() {
		const previousSong = this.queue.previous;

		if (previousSong) {
			console.log(`Playing previous song: ${previousSong.title}`);
			this.play(previousSong);
		}
	}

	public pause(pause: boolean): this {
		this.manager.emit('queueUpdate', this, pause ? UpdateType.PAUSE : UpdateType.RESUME);
		return super.pause(pause);
	}

	public toggleRepeat() {
		if (this.trackRepeat) {
			this.setQueueRepeat(true);
		} else if (this.queueRepeat) {
			this.setTrackRepeat(true);
		} else {
			this.setQueueRepeat(false);
		}

		this.manager.emit('queueUpdate', this, UpdateType.REPEAT);
	}
}

