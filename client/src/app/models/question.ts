export class Question {

	constructor(public id: number,
	            public title: string,
	            public timestamp: number,
	            public vote: number,
	            public comments: {
		            message: string,
		            timestamp: number
	            }[]) {}
}