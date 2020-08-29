import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelService} from '../../services/channel.service';
import {Channel} from '../../model/Channel';
import {Category} from '../../model/Category';
import {CategoryService} from '../../services/category.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {merge, Observable, of as observableOf, Subscription} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {UserService} from '../../services/user.service';
import {User} from '../../model/User';
import {UserChannel} from '../../model/UserChannel';
import {CommunicationDirection} from '../../model/CommunicationDirection';
import {CommunicationDirectionService} from '../../service/communication-direction/communication-direction.service';
import {ChannelStatus} from '../../model/ChannelStatus';
import {ChannelRole} from '../../model/ChannelRole';

@Component({
  selector: 'app-make-channel',
  templateUrl: './make-channel.component.html',
  styleUrls: ['./make-channel.component.css']
})
export class MakeChannelComponent implements OnInit, AfterViewInit, OnDestroy {

  public form: FormGroup;
  channels: Channel[];
  categories: Category[];
  communicationDirections: CommunicationDirection[];
  usersId: Set<number> = new Set<number>();

  pageSize = 10;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'dateCreated'];
  exampleDatabase: ExampleHttpDatabase | null;
  data: User1[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  private subs: Subscription[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formBuilder: FormBuilder,
              private channelService: ChannelService,
              private categoryService: CategoryService,
              private _httpClient: HttpClient,
              private userService: UserService,
              private communicationDirectionService: CommunicationDirectionService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: [''],
      communicationDirection: ['']
    });

    this.channelService.getChannels().subscribe((value) => {
      this.channels = value;
    });
    this.categoryService.getCategories().subscribe((value) => {
      this.categories = value;
    });
    this.userService.totalCount().subscribe(value => {
      this.resultsLength = value;
    });
    this.communicationDirectionService.getCommunicationDirections().subscribe(
      value => this.communicationDirections = value);
  }

  makeChannel() {
    let channel: Channel = new Channel();
    let category: Category = new Category();
    let communicationDirection: CommunicationDirection = new CommunicationDirection();
    let channelStatus: ChannelStatus = new ChannelStatus();

    category.id = this.getIdByName(this.categories,
      this.form.get('category').value);
    communicationDirection.id = this.getIdByName(this.communicationDirections,
      this.form.get('communicationDirection').value);
    channelStatus.id = 1;
    channel.name = this.form.get('name').value;
    channel.category = category;
    channel.communicationDirection = communicationDirection;
    channel.channelStatus = channelStatus;
    for (let id of this.usersId) {
      let userChannel: UserChannel = new UserChannel();
      let channelRole: ChannelRole = new ChannelRole();
      channelRole.id = 1;
      userChannel.channelRole = channelRole;
      let user: User = new User();
      user.id = id;
      userChannel.user = user;
      channel.userChannels.push(userChannel);
    }
    console.log(channel);
    this.subs.push(this.channelService.saveChannel(channel).subscribe(
      (response: Channel) => {
        console.log(response);
      },
      (errorResponse: HttpErrorResponse) => {
        console.dir(errorResponse); // TODO odradi obradjivanje greska
      }
    ));
  }

  ngAfterViewInit(): void {
    this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            'id', this.sort.direction, this.paginator.pageIndex, this.pageSize);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  addUser(row: any) {
    if (this.usersId.has(row.id)) {
      this.usersId.delete(row.id);
    } else {
      this.usersId.add(row.id);
    }
    console.log(this.usersId);
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  private getIdByName(list: any[], value: any) {
    for (let item of list) {
      if (item.name === value) {
        return item.id;
      }
    }
  }
}

export interface User1 {
  firstName: string;
}

export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {
  }

  getRepoIssues(sort: string, order: string, page: number, pageSize: number): Observable<User1[]> {
    const href = 'http://localhost:8080/user/all_pagination';
    const requestUrl =
      `${href}?sort=${sort},${order}&page=${page}&size=${pageSize}`;

    console.log(requestUrl);
    return this._httpClient.get<User1[]>(requestUrl);
  }
}
