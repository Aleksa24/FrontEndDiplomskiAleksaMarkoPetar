import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelService} from '../../../../service/channel/channel.service';
import {Channel} from '../../../../model/Channel';
import {Category} from '../../../../model/Category';
import {CategoryService} from '../../../../service/category/category.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {UserService} from '../../../../service/user/user.service';
import {CommunicationDirection} from '../../../../model/CommunicationDirection';
import {CommunicationDirectionService} from '../../../../service/communication-direction/communication-direction.service';
import {ChannelStatus} from '../../../../model/ChannelStatus';
import {ActivatedRoute, Router} from '@angular/router';
import {faImage, faPaperclip} from '@fortawesome/free-solid-svg-icons';
import {UserChannel} from '../../../../model/UserChannel';
import {ChannelRole} from '../../../../model/ChannelRole';
import {User} from '../../../../model/User';
import {AuthenticationService} from '../../../../service/authentication/authentication.service';
import {url} from 'inspector';
import {Message, ValidationFailedResponse} from '../../../../http/response/ValidationFailedResponse';

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
  public profileImage;
  public profileImageUpload;
  faUpload = faImage;
  nameValidationFailedResponseMessage = '';

  constructor(private formBuilder: FormBuilder,
              private channelService: ChannelService,
              private categoryService: CategoryService,
              private http: HttpClient,
              private userService: UserService,
              private communicationDirectionService: CommunicationDirectionService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.initDefaultProfilePicture();
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
    // this.subs.push(this.activatedRoute.paramMap.pipe(
    //   switchMap((params) => {
    //     return params.get('id');
    //   })
    // ).subscribe((value) => {
    //   this.parentChannelId = Number(value);
    //   console.log(value);
    // }));

    this.subs.push(this.activatedRoute.paramMap.subscribe(
      (paramMap) => {
        this.parentChannelId = Number(paramMap.get('id'));
      }
    ));
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
    if (this.parentChannelId !== -1) {
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

    let userChannel: UserChannel = new UserChannel();
    let channelRole: ChannelRole = new ChannelRole();
    channelRole.id = 2;
    userChannel.channelRole = channelRole;
    let user: User = new User();
    user.id = this.authenticationService.getUserFromLocalCache().id;
    userChannel.user = user;
    channel.userChannels.push(userChannel);

    this.subs.push(this.channelService.saveChannel(channel).subscribe(
      (response: Channel) => {
        const formData = new FormData();
        formData.append('id', String(response.id));
        formData.append('profileImage', this.profileImageUpload);
        this.channelService.uploadProfileImage(formData).subscribe(
          (data) => {
            console.log(data.message);
            this.router.navigate([`/channel/${response.id}`]).then();
          }
        );
      },
      (error: ValidationFailedResponse) => {
        console.log(error);
        this.nameValidationFailedResponseMessage = MakeChannelComponent.findByName(error.error.error, 'name');
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

  detectFile(event): void {
    if (event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (readerEvent) => {
        this.profileImage = reader.result;
      };
      this.profileImageUpload = event.target.files[0];
      console.log(this.profileImageUpload);
    }
  }


  private initDefaultProfilePicture(): void {

    this.profileImage = this.channelService.getDefaultPictureUrl();
    this.channelService.getDefaultPicture().subscribe(
      (data) => {
        this.profileImageUpload = new File([data], 'channel-default-image.png');
        console.log(this.profileImageUpload);
      }
    );
  }

  private static findByName(error: Message[], name: string) {
    for (let item of error) {
      if (item.type == name) {
        return item.message;
      }
    }
    return '';
  }
}

