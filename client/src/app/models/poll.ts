export class Poll {
	constructor(public id: number,
	            public title: string,
	            public isExclusive: boolean,
	            public answers: {
		            title: string,
		            votes: number
	            }[]) {

	}
}