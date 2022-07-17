import { Player } from "erela.js";
import { Node } from "erela.js/structures/Node";
import { Track, UnresolvedTrack } from "erela.js/structures/Player";

declare module "erela.js/structures/Manager" {
	interface Manager {
		on(event: "trackAdd", listener: (player: Player, track: Track | UnresolvedTrack, offset?: number) => void): this;
	}
}

declare module "erela.js/structures/Player" {
	interface Player {
		add(track: (Track | UnresolvedTrack) | (Track | UnresolvedTrack)[], offset?: number): void;
		skip(amount?: number): void;
		previous(): void;
		toggleRepeat(): void;
	}
}

export default class ExtendedPlayer extends Player {

	public add(track: (Track | UnresolvedTrack) | (Track | UnresolvedTrack)[], offset?: number) {
		this.queue.add(track, offset);
		this.manager.emit('trackAdd', this, track, offset);
	}

	public skip(amount?: number) {
		super.stop(amount);
	}

	public previous() {
		const previousSong = this.queue.previous;

		if(previousSong) {
			console.log(`Playing previous song: ${previousSong.title}`);
			this.play(previousSong);
		}
	}

	public toggleRepeat() {
		if(this.trackRepeat) {
			this.setQueueRepeat(true);
		} else if(super.queueRepeat) {
			this.setTrackRepeat(true);
		} else {
			this.setQueueRepeat(false);
		}
	}
}

