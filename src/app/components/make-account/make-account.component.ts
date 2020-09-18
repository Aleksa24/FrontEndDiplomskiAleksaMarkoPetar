import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';
import {UserService} from '../../service/user/user.service';
import {AuthenticationService} from '../../service/authentication/authentication.service';
import {DomSanitizer} from '@angular/platform-browser';
import {User} from '../../model/User';
import {HttpErrorResponse} from '@angular/common/http';
import {HttpResponse} from '../../model/HttpResponse';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-make-account',
  templateUrl: './make-account.component.html',
  styleUrls: ['./make-account.component.css']
})
export class MakeAccountComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  private subs: Subscription[] = [];
  public user: User;
  public token: string;
  public showDetails = false;
  public passwordStrength = 0;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private authenticationService: AuthenticationService,
              private sanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute,
              private dialogService: MatDialog,
              private router: Router) {
  }


  ngOnInit(): void {
    this.subs.push(this.activatedRoute.paramMap.subscribe(
      paramMap => {
        this.token = String(paramMap.get('hash'));
        const id = Number(paramMap.get('id'));
        this.authenticationService.verifyActivationToken(this.token, id).subscribe(
          (user) => {
            this.user = user;
            this.initAccountActivation();
          }, error => {
            this.router.navigateByUrl('/error');
          }
        );
      }
    ));
  }
  public initAccountActivation(): void{


    this.form = this.formBuilder.group({
      firstName: [this.user.firstName, [Validators.required]],
      lastName: [this.user.lastName, [Validators.required]],
      username: [this.user.username, [Validators.required]],
      phone: [this.user.phone],
      password: ['', [Validators.required, this.strongPasswordValidator]],
      confirm_password: ['', [Validators.required]]
    });

  }

  private strongPasswordValidator(control: AbstractControl): {[key: string]: boolean} | null{
    const password = control.value;
    if (password.match('[a-z]')?.length > 0
      && password.match('[0-9]')?.length > 0
      && password.match('[a-z]')?.length > 0
      && password.match('[!@#$%^&*(),.?":{}|<>]')?.length > 0
      && password.length >= 8){
      return null;
    }
    return {weak: true};
  }

  updateUser(): void {
    const dialogRef = this.dialogService.open(ConfirmDialogComponent,
      {data: 'You are about to save your account. Proceed?'});
    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          const user: User = this.user;
          user.firstName = this.form.get('firstName').value;
          user.lastName = this.form.get('lastName').value;
          user.username = this.form.get('username').value;
          user.phone = this.form.get('phone').value;

          const salt = bcrypt.genSaltSync(10);
          user.password = '{bcrypt}' + bcrypt.hashSync(this.form.get('password').value, salt);

          this.subs.push(this.userService.makeAccount(user, this.token).subscribe(
            (response: User) => {
              console.log();
              this.router.navigateByUrl('');
            },
            (errorResponse: HttpErrorResponse) => {
              console.dir(errorResponse);
              this.router.navigateByUrl('error');
            }
          ));
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }


  onStrengthChanged($event: number): void {
  }

  passwordMismatch(): boolean{
    return this.form.get('password').value !== this.form.get('confirm_password').value;
  }
}
