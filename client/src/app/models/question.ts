import {Comment} from './comment';

export class Question {

	constructor(public id: number,
	            public title: string,
	            public timestamp: Date,
	            public balance: number,
	            public comments: Comment[]) {}
}