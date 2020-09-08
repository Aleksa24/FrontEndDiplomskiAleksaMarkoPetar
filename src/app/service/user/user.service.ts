import {Injectable} from '@angular/core';
import {User} from '../../model/User';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Role} from '../../model/Role';
import {Post} from '../../model/Post';
import {AuthenticationService} from '../authentication/authentication.service';
import {Attachment} from '../../model/Attachment';
import {HttpResponse} from '../../model/HttpResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  REMOVE: string = 'remove';
  ADD: string = 'add';

  public host = environment.resourceServerUrl;

  constructor(private http: HttpClient,
              private authService: AuthenticationService) {
  }

  findByUsername(username: string): Promise<User> {
    return this.http.get<User>(`${this.host}/user/find-by-username?username=${username}`).toPromise();
  }

  addUser(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>
    (`${this.host}/user/add`, user);
  }

  updateProfile(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User | HttpErrorResponse>
    (`${this.host}/user/save`, user);
  }

  totalCount(): Observable<number> {
    return this.http.get<number>(`${this.host}/user/total_count`);
  }

  addFavourite(post: Post, addOrRemove: string): Observable<User> {
    let loggedUser = this.authService.getUserFromLocalCache();
    if (addOrRemove === this.ADD) {
      loggedUser.favorites.push(post);
    }
    if (addOrRemove === this.REMOVE) {
      loggedUser.favorites = loggedUser.favorites.filter((value) => value.id != post.id);
    }
    return this.http.post<User>(`${environment.resourceServerUrl}/user/save`, loggedUser);
  }

  getProfilePictureById(id: number): string {
    return `${environment.resourceServerUrl}/user/${id}/profile-picture`;
  }

  uploadProfileImage(formData: FormData): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.resourceServerUrl}/user/upload-profile-image`, formData);
  }
}
