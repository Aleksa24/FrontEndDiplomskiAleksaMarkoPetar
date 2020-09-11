import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelService} from '../../../../service/channel/channel.service';
import {Channel} from '../../../../model/Channel';
import {Category} from '../../../../model/Category';
import {CategoryService} from '../../../../service/category/category.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import { switchMap} from 'rxjs/operators';
import {UserService} from '../../../../service/user/user.service';
import {CommunicationDirection} from '../../../../model/CommunicationDirection';
import {CommunicationDirectionService} from '../../../../service/communication-direction/communication-direction.service';
import {ChannelStatus} from '../../../../model/ChannelStatus';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-make-channel',
  templateUrl: './make-channel.component.html',
  styleUrls: ['./make-channel.component.css']
})
export class MakeChannelComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  channels: Channel[];
  categories: Category[];
  communicationDirections: CommunicationDirection[];
  parentChannelId: number;
  private subs: Subscription[] = [];

  constructor(private formBuilder: FormBuilder,
              private channelService: ChannelService,
              private categoryService: CategoryService,
              private http: HttpClient,
              private userService: UserService,
              private communicationDirectionService: CommunicationDirectionService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initForm();
    this.initParentChannelId();
    this.initCategories();
    this.initCommunicationDirections();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      communicationDirection: ['', [Validators.required]]
    });
  }

  private initParentChannelId() {
    this.subs.push(this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        return params.get('id');
      })
    ).subscribe((value) => {
      this.parentChannelId = parseInt(value);
    }));
  }

  private initCategories() {
    this.categoryService.getCategories().subscribe((value) => {
      this.categories = value;
    });
  }

  private initCommunicationDirections() {
    this.communicationDirectionService.getCommunicationDirections().subscribe(
      value => this.communicationDirections = value);
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  makeChannel() {
    let channel: Channel = new Channel();
    let category: Category = new Category();
    let communicationDirection: CommunicationDirection = new CommunicationDirection();
    let channelStatus: ChannelStatus = new ChannelStatus();

    console.log(this.parentChannelId);
    if (this.parentChannelId !== 0) {
      let parentChannel: Channel = new Channel();
      parentChannel.id = this.parentChannelId;
      channel.parentChannel = parentChannel;
    }

    category.id = MakeChannelComponent.getIdByName(this.categories,
      this.form.get('category').value);
    communicationDirection.id = MakeChannelComponent.getIdByName(this.communicationDirections,
      this.form.get('communicationDirection').value);
    channelStatus.id = 1;
    channel.name = this.form.get('name').value;
    channel.category = category;
    channel.communicationDirection = communicationDirection;
    channel.channelStatus = channelStatus;
    // for (let id of this.usersId) {
    //   let userChannel: UserChannel = new UserChannel();
    //   let channelRole: ChannelRole = new ChannelRole();
    //   channelRole.id = 1;
    //   userChannel.channelRole = channelRole;
    //   let user: User = new User();
    //   user.id = id;
    //   userChannel.user = user;
    //   channel.userChannels.push(userChannel);
    // }
    console.log(channel);
    this.subs.push(this.channelService.saveChannel(channel).subscribe(
      (response: Channel) => {
        this.router.navigate([`/channel/${response.id}`]).then();
      },
      (errorResponse: HttpErrorResponse) => {
        console.dir(errorResponse); // TODO error handle
      }
    ));
  }

  private static getIdByName(list: any[], value: any) {
    for (let item of list) {
      if (item.name === value) {
        return item.id;
      }
    }
  }


}

