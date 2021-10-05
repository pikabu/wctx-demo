function getMonthsForLocale(locale: string) {
	const format = new Intl.DateTimeFormat(locale, {month: 'long'});
	const months = [];
	for (let month = 0; month < 12; month++) {
		months.push(format.format(new Date(Date.UTC(2000, month, 1, 0, 0, 0))))
	}
	return months;
}

const MONTHS = getMonthsForLocale('ru-RU');

export class MonthModel {
	month: number;
	year: number;
	title: string;

	constructor(public readonly id: string) {
		const [month, year] = id.split('.').map(Number);
		this.month = month - 1;
		this.year = year;
		this.title = `${MONTHS[month - 1]} ${year}`;
	}
}
