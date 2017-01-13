import {Question} from "./question";
import {Poll} from "./poll";

export class Room {
	id: number;
	title: string;
	questions: Question[];
	polls: Poll[];
}