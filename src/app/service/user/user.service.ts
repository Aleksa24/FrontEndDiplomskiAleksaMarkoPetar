import {Injectable} from '@angular/core';
import {User} from '../../model/User';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Role} from '../../model/Role';
import {Post} from '../../model/Post';
import {AuthenticationService} from '../authentication/authentication.service';
import {Attachment} from '../../model/Attachment';
import {HttpResponse} from '../../model/HttpResponse';
import {Category} from '../../model/Category';
import {UsersPaginationResponse} from '../../http/response/UsersPaginationResponse';

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

  findAll(page: number, size: number): Observable<UsersPaginationResponse> {
    let params = new HttpParams();
    params = params.append('page', String(page));
    params = params.append('size', String(size));
    return this.http.get<UsersPaginationResponse>(
      environment.resourceServerUrl + '/user/all-pagination', {params});
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

  getProfilePictureById(id: number): Observable<Blob> {
    return this.http.get(`${environment.resourceServerUrl}/user/${id}/profile-picture`, {
      responseType: 'blob'
    });
  }

  uploadProfileImage(formData: FormData): Observable<HttpResponse> {
    return this.http.post<HttpResponse>(`${environment.resourceServerUrl}/user/upload-profile-image`, formData);
  }
}
