import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelService} from '../../services/channel.service';
import {Channel} from '../../model/Channel';
import {Category} from '../../model/Category';
import {CategoryService} from '../../services/category.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {HttpClient} from '@angular/common/http';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-make-channel',
  templateUrl: './make-channel.component.html',
  styleUrls: ['./make-channel.component.css']
})
export class MakeChannelComponent implements OnInit, AfterViewInit {

  public form: FormGroup;
  channels: Channel[];
  categories: Category[];

  pageSize = 10;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'dateCreated'];
  exampleDatabase: ExampleHttpDatabase | null;
  data: User[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private formBuilder: FormBuilder,
              private channelService: ChannelService,
              private categoryService: CategoryService,
              private _httpClient: HttpClient,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['']
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
  }

  makeChannel() {

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
}

export interface User {
  firstName: string;
}

export class ExampleHttpDatabase {
  constructor(private _httpClient: HttpClient) {
  }

  getRepoIssues(sort: string, order: string, page: number, pageSize: number): Observable<User[]> {
    const href = 'http://localhost:8080/user/all_pagination';
    const requestUrl =
      `${href}?sort=${sort},${order}&page=${page}&size=${pageSize}`;

    console.log(requestUrl);
    return this._httpClient.get<User[]>(requestUrl);
  }
}
