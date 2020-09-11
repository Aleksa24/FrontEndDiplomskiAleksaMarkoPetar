import {Component, OnDestroy, OnInit} from '@angular/core';
import {Channel} from '../../model/Channel';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ChannelService} from '../../service/channel/channel.service';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {environment} from '../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.css']
})
export class ChannelsComponent implements OnInit, OnDestroy {

  channels$: Promise<Channel[]>;
  channels: Channel[];
  subs: Subscription[] = [];

  constructor(private router: Router,
              private channelService: ChannelService,
              private authenticationService: AuthenticationService,
              private sanitizer: DomSanitizer) {
  }

  async ngOnInit() {
    this.channels$ = this.channelService.getChannelsForUser(this.authenticationService.getUserFromLocalCache().id);
    await this.channels$.then((value) => {
      this.channels = value;
    });

    this.channels.forEach(channel =>
      this.channelService.getProfilePictureById(channel.id).subscribe(
        data => {
          const objectURL = URL.createObjectURL(data);
          const img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          channel.profilePicture = img;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  getProfilePictureForChannel(id: number) {
    return this.channelService.getProfilePictureById(id).subscribe(
      data => {
        return data;
      }
    );
  }
}
