import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChannelsComponent } from './components/channels/channels.component';
import { FavouritesComponent } from './components/favourites/favourites.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import {MatCardModule} from '@angular/material/card';
import {UpdateProfileComponent} from './components/update-profile/update-profile.component';
import { PostComponent } from './components/post/post.component';
import { CommentComponent } from './components/comment/comment.component';
import {ChannelComponent} from './components/channels/channel/channel.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatMenuModule} from '@angular/material/menu';
import { MakeChannelComponent } from './components/channels/channel/make-channel/make-channel.component';
import {MatSelectModule} from '@angular/material/select';
import {PostNewComponent} from './components/post/post-new/post-new.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import { AttachmentComponent } from './components/attachment/attachment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {AuthInterceptor} from './intreceptor/auth.interceptor';
import { EditChannelComponent } from './components/edit-channel/edit-channel.component';
import { AddUsersComponent } from './components/edit-channel/add-users/add-users.component';
import { RemoveUsersComponent } from './components/edit-channel/remove-users/remove-users.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MakeAccountComponent } from './components/make-account/make-account.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {PasswordStrengthMeterModule} from 'angular-password-strength-meter';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import {MatPasswordStrengthModule} from '@angular-material-extensions/password-strength';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainNavComponent,
    ChannelsComponent,
    FavouritesComponent,
    AddUserComponent,
    ChannelComponent,
    UpdateProfileComponent,
    PostComponent,
    CommentComponent,
    MakeChannelComponent,
    PostNewComponent,
    AttachmentComponent,
    EditChannelComponent,
    AddUsersComponent,
    RemoveUsersComponent,
    MakeAccountComponent,
    ConfirmDialogComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatRadioModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    PasswordStrengthMeterModule,
    MatPasswordStrengthModule,
    MatSliderModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
