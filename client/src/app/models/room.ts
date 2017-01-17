import {Question} from "./question";
import {Poll} from "./poll";

export class Room {
	id: string;
	title: string;
	questions: Question[];
	polls: Poll[];

	constructor(id: string, title: string) {
		this.id = id;
		this.title = title;
	}
}