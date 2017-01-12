import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class PollcatService {
	private titleSource = new Subject<string>();

	title = this.titleSource.asObservable();

	updateTitle(t: string) {
		this.titleSource.next(t);
	}
}