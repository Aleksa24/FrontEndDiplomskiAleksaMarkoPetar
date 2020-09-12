import {Component, Inject, Input, OnInit} from '@angular/core';
import {UsersPaginationResponse} from '../../../http/response/UsersPaginationResponse';
import {PageEvent} from '@angular/material/paginator';
import {UserService} from '../../../service/user/user.service';
import {Channel} from '../../../model/Channel';
import {Subscription} from 'rxjs';
import {AuthenticationService} from '../../../service/authentication/authentication.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {

  dataSource: UsersPaginationResponse = null;
  pageEvent: PageEvent;
  columnsToDisplay: string[] = ['firstName', 'lastName', 'email'];


  subs: Subscription[] = [];

  usersId: Set<number> = new Set<number>();

  constructor(private userService: UserService,
              private authenticationService: AuthenticationService,
              @Inject(MAT_DIALOG_DATA) private  channelId) {
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    console.log(this.channelId);
    this.userService.findAllUsersNotInChannel(this.channelId,
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
    this.userService.findAllUsersNotInChannel(this.channelId,
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

  addUsersToChannel() {
    // TODO
  }


}
