import {createContext, defineElement, Type} from 'wctx';
import {CommentModel, VOTE} from 'src/app/models/Comments/CommentModel';
import template from 'templates/components/Comment/CommentRating.twig';
import 'app/components/Comments/CommentRating/CommentRating.scss';

@defineElement('pkb-comment-rating')
export class CommentRating extends HTMLElement {
	ctx = createContext(this, {
		model: CommentModel,
		modelInitProp: 'commentsId',
		parentTag: 'pkb-comment',
		props: {
			commentsId: Type.Number,
			currentVote: Type.Number,
			rating: Type.Number,
		},
		els: {
			rating: HTMLElement,
			up: HTMLButtonElement,
			down: HTMLButtonElement,
		},
	});

	mount() {
		const {scope, els, model} = this.ctx;

		this.ctx.hook('currentVote', () => {
			delete els.up.dataset.active;
			delete els.down.dataset.active;
			if (scope.currentVote === VOTE.UP) {
				els.up.dataset.active = 'true';
			}
			if (scope.currentVote === VOTE.DOWN) {
				els.down.dataset.active = 'true';
			}
			const rating = scope.rating + scope.currentVote;
			els.rating.textContent = rating > 0 ? `+${rating}` : String(rating);
		});

		els.up.onclick = () => model.voteDirection(VOTE.UP);
		els.down.onclick = () => model.voteDirection(VOTE.DOWN);

	}

	getTemplate() {
		return template(this.ctx.scope);
	}
}
