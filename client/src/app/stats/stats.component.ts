import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ApiService} from "../services/api.service";
import {PollcatService} from "../services/pollcat.service";
import {SocketService} from "../services/socket.service";
import {Poll} from "../models/poll";
import {Room} from "../models/room";
import {Subscription} from "rxjs";

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit, OnDestroy {
	private room: Room;
	private poll: Poll;
	private pollTitle: string = 'Loading...';


	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = [];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [
		{data: [], label: 'Number of votes'}
	];

	private subs: Subscription[] = [];

	constructor(private router: Router,
	            private route: ActivatedRoute,
	            private apiService: ApiService,
	            private socketService: SocketService,
	            private pollcatService: PollcatService) {
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			var roomNumber = params['roomNumber'];
			var pollId = +params['pollId'];
			console.log(pollId);
			this.pollcatService.updateTitle("");

			this.socketService.pollUpdate.subscribe(poll => {
				console.log(pollId);
				console.log(poll.id);
				if (poll.id === pollId) {
					this.poll = poll;
					this.barChartData[0]['data'] = [];
					for (let a of poll.answers) {
						this.barChartData[0]['data'].push(a.votes);
					}
				}
			});

			this.apiService.roomFetch.subscribe(room => {
				this.room = room;
				var poll = room.polls.find(p => p.id === pollId);
				this.poll = poll;
				this.pollTitle = poll.title;
				this.barChartLabels = [];
				this.barChartData[0]['data'] = [];
				for (let a of poll.answers) {
					this.barChartLabels.push(a.title);
					this.barChartData[0]['data'].push(a.votes);
				}
				this.pollcatService.updateTitle(room.title);
			});

			this.socketService.roomJoin.subscribe(join => {
				this.apiService.fetchRoom(roomNumber);
			}, error => {
			});
			this.socketService.joinRoom(roomNumber);
		});
	}

	ngOnDestroy() {
		for (let sub of this.subs) {
			sub.unsubscribe();
		}
	}

	goBack(): void {
		this.router.navigateByUrl('/room/' + this.room.id);
	}

}
