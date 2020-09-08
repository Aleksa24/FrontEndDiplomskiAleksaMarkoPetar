import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription, throwError} from 'rxjs';
import {UserService} from '../../service/user/user.service';
import {User} from '../../model/User';
import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';
import {catchError, map} from 'rxjs/operators';
import {Attachment} from '../../model/Attachment';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private subs: Subscription[] = [];
  public profileImage;
  public profileImageUpload: any;
  faUpload = faPaperclip;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: [this.authenticationService.getUserFromLocalCache().firstName, [Validators.required]],
      lastName: [this.authenticationService.getUserFromLocalCache().lastName, [Validators.required]],
      username: [this.authenticationService.getUserFromLocalCache().username, [Validators.required]],
      phone: [this.authenticationService.getUserFromLocalCache().phone]
    });
    this.profileImage = this.userService.getProfilePictureById(this.authenticationService.getUserFromLocalCache().id);
  }

  updateUser() {
    let user: User = this.authenticationService.getUserFromLocalCache();
    user.firstName = this.form.get('firstName').value;
    user.lastName = this.form.get('lastName').value;
    user.username = this.form.get('username').value;
    user.phone = this.form.get('phone').value;
    console.log(user);
    this.subs.push(this.userService.updateProfile(user).subscribe(
      (response: User) => {
        this.authenticationService.saveUserToLocalCache(user);
      },
      (errorResponse: HttpErrorResponse) => {
        console.dir(errorResponse);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
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

  onChangeProfilePicture(): void {
    if (this.profileImageUpload === undefined){
      return;
    }
    const formData = new FormData();
    formData.append('profileImage', this.profileImageUpload);
    formData.append('id', String(this.authenticationService.getUserFromLocalCache().id));
    this.userService.uploadProfileImage(formData).subscribe(
      (data) => {
        alert(data.message);
      }
    );
  }
}
