

export class Question {
	id: number;
	title: string;
	timestamp: number;
	vote: number;
	comments: {
		message: string,
		timestamp: number
	}[];
}