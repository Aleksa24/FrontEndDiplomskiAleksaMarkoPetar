import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelService} from '../../services/channel.service';
import {ActivatedRoute} from '@angular/router';
import {Channel} from '../../model/Channel';
import {switchMap} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {
  channel$: Observable<Channel>;
  channel: Channel;
  subs: Subscription[] = [];

  constructor(private channelService: ChannelService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subs.push(this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return this.channelService.getById(parseInt(id));
      })
    ).subscribe((value) => this.channel = value));

  }

  printChannel(): string {
    return JSON.stringify(this.channel);
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }
}
