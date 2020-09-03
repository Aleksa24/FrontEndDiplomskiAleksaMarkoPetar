import {Component, OnDestroy, OnInit} from '@angular/core';
import {Channel} from "../../model/Channel";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {ChannelService} from "../../services/channel.service";
import {AuthenticationService} from '../../services/authentication.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit, OnDestroy{

  //neka se crveni radi sta treba za sada, ovo je samo za testiranje da li radi sta treba
  channels$: Observable<Channel[]>;
  channels: Channel[];
  subs: Subscription[] = [];

  constructor(private router: Router,
              private channelService: ChannelService,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.channels$ = this.channelService.getChannelsForUser(this.authenticationService.getUserFromLocalCache().id);
    this.channels$.subscribe((value) => {
      this.channels = value;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe())
  }

  getProfilePictureForChannel(id: number) {
    return this.channelService.getProfilePictureById(id).subscribe(
      data => {
        return data;
      }
    );
  }

  getProfilePictureByChannelId(id: number): string{
    return `${environment.apiUrl}/channel/${id}/profile-picture`;
  }
}
