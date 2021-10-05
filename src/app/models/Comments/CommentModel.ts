import {debounce} from 'utils/debounce';

export enum VOTE {
	DOWN = -1,
	NONE,
	UP,
}

export class CommentModel {
	rating = 0;
	currentVote: VOTE = VOTE.NONE;
	syncedVote: VOTE = VOTE.NONE;

	constructor(public commentId: number) {}

	voteDirection(vote: VOTE.UP | VOTE.DOWN) {
		vote = this.currentVote + vote;
		this.currentVote = (vote > VOTE.UP || vote < VOTE.DOWN) ? VOTE.NONE : vote;
		this.syncVote();
	}

	@debounce(700)
	private syncVote() {
		// ...
	}
}
