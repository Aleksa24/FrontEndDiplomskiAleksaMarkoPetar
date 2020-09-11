import {Component, OnInit} from '@angular/core';
import {ChannelService} from '../../service/channel/channel.service';
import {Channel} from '../../model/Channel';
import {switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
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


  constructor(private channelService: ChannelService,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private categoryService: CategoryService,
              private communicationDirectionService: CommunicationDirectionService,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer) {
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
      category: [this.channel.category.name],
      communicationDirection: [this.channel.communicationDirection.name]
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
    const dialogRef = this.dialog.open(AddUsersComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  removeUsers() {
    const dialogRef = this.dialog.open(RemoveUsersComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  editChannel() {
    // TODO
  }


  detectFile(event): void{
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
