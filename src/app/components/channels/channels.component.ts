import {Component, OnDestroy, OnInit} from '@angular/core';
import {Channel} from "../../model/Channel";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ChannelService} from "../../services/channel.service";

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit, OnDestroy{

  //neka se crveni radi sta treba za sada, ovo je samo za testiranje da li radi sta treba
  channels: Channel[];
  subs: Subscription[] = [];

  constructor(private router: Router,
              private channelService: ChannelService) { }

  ngOnInit(): void {
    this.channels = this.channelService.getChannels();
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe())
  }
}
