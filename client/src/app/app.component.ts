import {Component} from '@angular/core';
import {PollCatPage} from "../../e2e/app.po";
import {PollcatService} from "./services/pollcat.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'Loading...';

	constructor(
		private pollcatService: PollcatService
	) {
		pollcatService.title.subscribe(newTitle => {
			this.title = newTitle;
		})
	}
}
