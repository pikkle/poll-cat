export class Poll {
	constructor(public id: number,
	            public title: string,
	            public timestamp: Date,
	            public isExclusive: boolean,
	            public answers: {
					id: number,
		            title: string,
		            votes: number
	            }[]) {

	}
}