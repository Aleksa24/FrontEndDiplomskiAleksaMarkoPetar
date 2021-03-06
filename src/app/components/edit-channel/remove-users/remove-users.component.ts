import {Component, Inject, OnInit} from '@angular/core';
import {UsersPaginationResponse} from '../../../http/response/UsersPaginationResponse';
import {PageEvent} from '@angular/material/paginator';
import {UserService} from '../../../service/user/user.service';
import {Channel} from '../../../model/Channel';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../service/authentication/authentication.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UserChannel} from '../../../model/UserChannel';
import {ChannelRole} from '../../../model/ChannelRole';
import {User} from '../../../model/User';
import {ChannelService} from '../../../service/channel/channel.service';

@Component({
  selector: 'app-remove-users',
  templateUrl: './remove-users.component.html',
  styleUrls: ['./remove-users.component.css']
})
export class RemoveUsersComponent implements OnInit {

  dataSource: UsersPaginationResponse = null;
  pageEvent: PageEvent;
  columnsToDisplay: string[] = ['firstName', 'lastName', 'email'];

  channel: Channel;
  subs: Subscription[] = [];

  usersId: Set<number> = new Set<number>();

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              private channelService: ChannelService,
              @Inject(MAT_DIALOG_DATA) private  channelId) {
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  private initDataSource() {
    this.userService.findAllUsersInChannel(this.channelId,
      this.authenticationService.getUserFromLocalCache().id,
      0,
      10).subscribe(
      (value: UsersPaginationResponse) => {
        console.log(value);
        this.dataSource = value;
      },
      error => console.log(error)
    );
  }

  onPaginateChange($event: PageEvent) {
    console.log($event);
    let page = $event.pageIndex;
    let size = $event.pageSize;
    this.userService.findAllUsersInChannel(this.channelId,
      this.authenticationService.getUserFromLocalCache().id,
      page,
      size).subscribe(
      (value: UsersPaginationResponse) => {
        console.log(value);
        this.dataSource = value;
      },
      error => console.log(error)
    );
  }

  addUser(row: any) {
    if (this.usersId.has(row.id)) {
      this.usersId.delete(row.id);
    } else {
      this.usersId.add(row.id);
    }
  }

  removeUsersFromChannel() {
    for (let id of this.usersId) {
      this.channelService.deleteUserChannel(id, this.channelId).subscribe(
        value => console.log(value),
        error => console.log(error)
      );
    }
  }
}
