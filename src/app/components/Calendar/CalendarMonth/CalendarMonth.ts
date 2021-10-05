import {createContext, defineElement, Type} from 'wctx';
import 'app/components/Calendar/CalendarMonth/CalendarMonth.scss';
import {MonthModel} from 'app/models/Calendar/MonthModel';
import {Calendar} from 'app/components/Calendar/Calendar/Calendar';

@defineElement('pkb-calendar-month')
export class CalendarMonth extends HTMLElement {
	ctx = createContext(this, {
		props: {
			id: Type.String,
			month: Type.Number,
			year: Type.Number,
		},
		model: MonthModel,
		modelInitProp: 'id',
		parentTag: 'div',
	});

	private getSettings() {
		const calendar = this.closest('pkb-calendar');
		if (!(calendar instanceof Calendar)) {
			return {};
		}
		return {
			minDate: calendar.ctx.scope.minDate,
			maxDate: calendar.ctx.scope.maxDate,
			selectedDate: calendar.ctx.scope.selectedDate,
		};
	}

	private getMonth(year: number, month = 0) {
		const date = new Date(Date.UTC(year, month, 1));
		const beforeMonth = new Date(Date.UTC(year, month, 0));
		const lastDateOfMonth = new Date(Date.UTC(year, month + 1, 0));
		const dates = [];
		const {minDate, maxDate, selectedDate} = this.getSettings();

		if (beforeMonth.getDay()) {
			for (let i = beforeMonth.getDate() - (beforeMonth.getDay() - 1); i <= beforeMonth.getDate(); i++) {
				dates.push(`<span>${i}</span>`);
			}
		}

		for (let i = 1; i <= lastDateOfMonth.getDate(); i++) {
			date.setDate(i);
			const isDisabled = minDate
				? minDate.getTime() > date.getTime()
				: maxDate
					? maxDate.getTime() < date.getTime()
					: false;
			const isSelected = selectedDate && !isNaN(selectedDate.getTime())
				? date.toISOString().slice(0, 10) === selectedDate.toISOString().slice(0, 10)
				: false;

			if (isDisabled) {
				dates.push(`<span>${i}</span>`);
			} else {
				dates.push(`<button data-date="${date.toISOString().slice(0, 10)}" ${isSelected ? ' data-selected' :''}>
					${i}</button>`);
			}
		}

		if (lastDateOfMonth.getDay()) {
			for (let i = 1, max = (7 - lastDateOfMonth.getDay()); i <= max; i++) {
				dates.push(`<span>${i}</span>`);
			}
		}

		return dates.join('');
	}

	getTemplate() {
		return `
			<pkb-calendar-month>
				<div itemprop="header"><p>пн</p><p>вт</p><p>ср</p><p>чт</p><p>пт</p><p>сб</p><p>вс</p></div>
				<div itemprop="days">${this.getMonth(this.ctx.scope.year, this.ctx.scope.month)}</div>
			</pkb-calendar-month>
		`;
	}
}
