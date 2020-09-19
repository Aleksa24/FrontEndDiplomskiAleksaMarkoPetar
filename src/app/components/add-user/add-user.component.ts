import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {User} from '../../model/User';
import {Role} from '../../model/Role';
import {HttpErrorResponse} from '@angular/common/http';
import {UserService} from '../../service/user/user.service';
import {Message} from '../../http/response/ValidationFailedResponse';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];
  emailTakenError = '';

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['example@mail.com', [Validators.required, Validators.email]],
      role: ['Student']
    });
  }

  addUser() {
    let user: User = new User();
    let role: Role = new Role();
    role.name = this.form.get('role').value;
    user.email = this.form.get('email').value;
    user.role = role;
    this.subs.push(this.userService.addUser(user).subscribe(
      (response: User) => {
        this.emailTakenError = '';
      },
      (errorResponse: HttpErrorResponse) => {
        this.emailTakenError = AddUserComponent.findByName(errorResponse.error.error, 'email');
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  private static findByName(error: Message[], name: string): string {
    for (let item of error) {
      if (item.type == name) {
        return item.message;
      }
    }
    return '';
  }
}
