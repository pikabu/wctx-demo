import {createContext, defineElement, Type} from 'wctx';
import {CommentModel} from 'src/app/models/Comments/CommentModel';
import 'app/components/Comments/Comment/Comment.scss';

@defineElement('pkb-comment')
export class Comment extends HTMLElement {
	ctx = createContext(this, {
		model: CommentModel,
		modelInitProp: 'commentsId',
		props: {
			commentsId: Type.Number,
		},
	});
}
