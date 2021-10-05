import {createContext, defineElement, pool, Type} from 'wctx';
import {addDelegatedListener, DelegateEvent} from 'app/utils/addDelegatedListener';
import 'app/components/Calendar/Calendar/Calendar.scss';
import {MonthModel} from 'src/app/models/Calendar/MonthModel';

@defineElement('pkb-calendar')
export class Calendar extends HTMLElement {
	ctx = createContext(this, {
		props: {
			amountMonths: Type.Number,
			monthsTitle: [Type.String],
			months: [MonthModel],
			selectedDate: Date,
			minDate: Date,
			maxDate: Date,
		},
		els: {
			prev: HTMLButtonElement,
			next: HTMLButtonElement,
			months: HTMLElement,
		},
	});

	mount() {
		const {els, scope} = this.ctx;

		els.prev.onclick = () => {
			const date = Calendar.getMonth(scope.months[scope.months.length - 1]);
			date.setMonth(date.getMonth() - 1);
			scope.months = [];
			scope.months = Calendar.fillMonths(date, scope.amountMonths, false);
		};

		els.next.onclick = () => {
			const date = Calendar.getMonth(scope.months[0]);
			date.setMonth(date.getMonth() + 1);
			scope.months = Calendar.fillMonths(date, scope.amountMonths);
		};

		const date = scope.selectedDate && !isNaN(scope.selectedDate.getTime())
			? new Date(scope.selectedDate)
			: new Date();
		scope.months = Calendar.fillMonths(date, scope.amountMonths);

		this.ctx.hook('months', () => {
			scope.monthsTitle = scope.months.map((m) => m.title);
		})();
	}

	@addDelegatedListener('click', 'button')
	private handleClickDay(e: DelegateEvent<MouseEvent, HTMLElement>) {
		const {els, scope} = this.ctx;
		const date = e.delegateTarget.dataset.date;
		if (!date) {
			return;
		}
		els.months.querySelectorAll('button[data-selected]').forEach((el) => {
			if (el instanceof HTMLElement) {
				delete el.dataset.selected;
			}
		});
		scope.selectedDate = new Date(date);
		e.delegateTarget.dataset.selected = '';
	}

	static getMonth(month?: MonthModel) {
		if (!month) {
			return new Date();
		}
		return new Date(month.year, month.month, 1);
	}

	static fillMonths(date: Date, amountMonths: number, forward = true): MonthModel[] {
		const months: MonthModel[] = [];
		while (amountMonths-- > 0) {
			months.push(pool(MonthModel, `${date.getMonth() + 1}.${date.getFullYear()}`));
			date.setMonth(date.getMonth() + (forward ? 1 : -1));
		}
		return forward ? months : months.reverse();
	}

	getTemplate() {
		return `
			<pkb-calendar itemscope>
				<div itemprop="header">
					<button itemprop="prev"><pkb-icon itemscope icon="16/back"></pkb-icon></button>
					<span itemprop="monthsTitle"></span>
					<button itemprop="next"><pkb-icon itemscope icon="16/next"></pkb-icon></button>
				</div>
				<div itemprop="months"></div>
				<div itemprop="buttons">
					<button is="pkb-button">Применить</button>
				</div>	
			</pkb-calendar>
		`;
	}
}
