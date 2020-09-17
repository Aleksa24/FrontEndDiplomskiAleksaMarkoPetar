import {Component, OnInit} from '@angular/core';
import {ChannelService} from '../../service/channel/channel.service';
import {Channel} from '../../model/Channel';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../service/category/category.service';
import {CommunicationDirectionService} from '../../service/communication-direction/communication-direction.service';
import {Category} from '../../model/Category';
import {CommunicationDirection} from '../../model/CommunicationDirection';
import {MatDialog} from '@angular/material/dialog';
import {AddUsersComponent} from './add-users/add-users.component';
import {RemoveUsersComponent} from './remove-users/remove-users.component';
import {DomSanitizer} from '@angular/platform-browser';
import {faImage} from '@fortawesome/free-solid-svg-icons';
import {ChannelStatus} from '../../model/ChannelStatus';
import {UserChannel} from '../../model/UserChannel';
import {ChannelRole} from '../../model/ChannelRole';
import {User} from '../../model/User';
import {Message, ValidationFailedResponse} from '../../http/response/ValidationFailedResponse';
import {AuthenticationService} from '../../service/authentication/authentication.service';

@Component({
  selector: 'app-edit-channel',
  templateUrl: './edit-channel.component.html',
  styleUrls: ['./edit-channel.component.css']
})
export class EditChannelComponent implements OnInit {

  channel: Channel;
  subs: Subscription[] = [];

  form: FormGroup;
  categories: Category[];
  communicationDirections: CommunicationDirection[];

  public profileImage;
  faUpload = faImage;
  private profileImageUpload: any;

  nameValidationFailedResponseMessage = '';
  globalValidationFailedResponseMessage = '';

  constructor(private channelService: ChannelService,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private categoryService: CategoryService,
              private communicationDirectionService: CommunicationDirectionService,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.initChannel();
    this.initCategories();
    this.initCommunicationDirection();
  }

  initChannel() {
    this.subs.push(this.activatedRoute.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return this.channelService.getById(parseInt(id));
      })
    ).subscribe((value) => {
      this.channel = value;
      this.channelService.getProfilePictureById(this.channel.id).subscribe(
        (data) => {
          this.profileImageUpload = new File([data], 'profile-image');
          // in case user does not change picture the same picture will be uploaded
          const objectURL = URL.createObjectURL(data);
          const img = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          this.profileImage = img;
        }
      );
      this.initForm();
    }));
  }

  private initForm() {
    console.log(this.channel);
    this.form = this.formBuilder.group({
      name: [this.channel.name, [Validators.required]],
      category: [this.channel.category.name, [Validators.required]],
      communicationDirection: [this.channel.communicationDirection.name, [Validators.required]]
    });
  }

  private initCategories() {
    this.categoryService.getCategories().subscribe((value) => {
      this.categories = value;
    });
  }

  private initCommunicationDirection() {
    this.communicationDirectionService.getCommunicationDirections().subscribe(
      value => this.communicationDirections = value);
  }

  addUsers() {
    this.dialog.open(AddUsersComponent, {data: this.channel.id}); // TODO fix bug inject users in edit-channel
  }

  removeUsers() {
    this.dialog.open(RemoveUsersComponent, {data: this.channel.id});
  }

  editChannel() {

    let channel: Channel = new Channel();
    channel.userChannels = this.channel.userChannels;
    channel.parentChannel = this.channel.parentChannel;
    channel.id = this.channel.id;
    channel.dateCreated = this.channel.dateCreated;

    let category: Category = new Category();
    let communicationDirection: CommunicationDirection = new CommunicationDirection();
    let channelStatus: ChannelStatus = new ChannelStatus();

    category.id = EditChannelComponent.getIdByName(this.categories,
      this.form.get('category').value);
    communicationDirection.id = EditChannelComponent.getIdByName(this.communicationDirections,
      this.form.get('communicationDirection').value);
    channelStatus.id = 1;
    channel.name = this.form.get('name').value;
    channel.category = category;
    channel.communicationDirection = communicationDirection;
    channel.channelStatus = channelStatus;

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
        this.nameValidationFailedResponseMessage = EditChannelComponent.findByName(error.error.error, 'name');
        this.globalValidationFailedResponseMessage = EditChannelComponent.findByName(error.error.error, 'global');
      }
    ));
  }

  private static findByName(error: Message[], name: string) {
    for (let item of error) {
      if (item.type == name) {
        return item.message;
      }
    }
    return '';
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
    }
  }
}
