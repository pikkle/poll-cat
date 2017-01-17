import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ApiService} from "../services/api.service";
import {PollcatService} from "../services/pollcat.service";
import {SocketService} from "../services/socket.service";
import {Poll} from "../models/poll";
import {Room} from "../models/room";

@Component({
	selector: 'app-stats',
	templateUrl: './stats.component.html',
	styleUrls: ['./stats.component.css'],
})
export class StatsComponent implements OnInit {
	private room: Room;
	private poll: Poll;
	private pollTitle: string = 'Loading...';


	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true
	};
	public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;

	public barChartData: any[] = [
		{data: [65, 59, 80, 81, 56, 55, 40], label: 'Number of votes'}
	];

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
				if (poll.id === pollId+1) {
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

	goBack(): void {
		this.router.navigateByUrl('/room/' + this.room.id);
	}

}
