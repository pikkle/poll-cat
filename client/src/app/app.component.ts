import {Component, OnDestroy} from '@angular/core';
import {PollCatPage} from "../../e2e/app.po";
import {PollcatService} from "./services/pollcat.service";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
	title = 'Loading...';
	private sub: Subscription;

	constructor(private pollcatService: PollcatService) {
		this.sub = pollcatService.title.subscribe(newTitle => {
			this.title = newTitle;
		})
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}
