import {Question} from "./question";
import {Poll} from "./poll";

export class Room {

	constructor(
		public id: string,
		public title: string,
		public questions: Question[],
		public polls: Poll[]) {
	}
}