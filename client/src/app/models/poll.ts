
export class Poll {
	id: number;
	title: string;
	isExclusive: boolean;
	answers: {
		title: string,
		votes: number
	}[]
}