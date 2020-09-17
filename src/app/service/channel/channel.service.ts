import {Injectable} from '@angular/core';
import {Channel} from '../../model/Channel';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Post} from '../../model/Post';
import {AuthenticationService} from '../authentication/authentication.service';
import {User} from '../../model/User';
import {Attachment} from '../../model/Attachment';
import {HttpResponse} from '../../model/HttpResponse';
import {UsersPaginationResponse} from '../../http/response/UsersPaginationResponse';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  public host = environment.resourceServerUrl;
  OWNER: string = 'Owner';
  PARTICIPANT: string = 'Participant';
  BIDIRECTIONAL: string = 'Bidirectional';
  UNIDIRECTIONAL: string = 'Unidirectional';

  constructor(private httpClient: HttpClient,
              private authService: AuthenticationService) {
  }

  getChannelsForUser(id: number): Promise<Channel[]> {
    return this.httpClient.get<Channel[]>(environment.resourceServerUrl + `/channel/findAllByUserId?id=${id}`).toPromise();
  }

  getById(id: number): Observable<Channel> {
    return this.httpClient.get<Channel>(environment.resourceServerUrl + `/channel/${id}`);
  }

  saveChannel(channel: Channel): Observable<Channel | HttpErrorResponse> {
    return this.httpClient.post<Channel | HttpErrorResponse>
    (`${this.host}/channel/save`, channel);
  }

  getProfilePictureById(id: number): Observable<Blob> {
    return this.httpClient.get(`${environment.resourceServerUrl}/channel/${id}/profile-picture`, {
      responseType: 'blob'
    });
  }

  uploadProfileImage(formData: FormData): Observable<HttpResponse> {
    return this.httpClient.post<HttpResponse>(`${environment.resourceServerUrl}/channel/upload-profile-image`, formData);
  }

  getDefaultPicture(): Observable<Blob> {
    return this.httpClient.get(`${environment.clientUrl}/assets/img/channel-default-image.png`, {responseType: 'blob'});
  }


  getDefaultPictureUrl(): string {
    return `${environment.clientUrl}/assets/img/channel-default-image.png`;
  }

  getChannelIdByPostId(id: number): Promise<number> {
    return this.httpClient.get<number>(`${environment.resourceServerUrl}/channel/find-id-by-post-id?postId=${id}`).toPromise();
  }

  isUserInChannel(channelId: number): Promise<boolean> {
    let userId = this.authService.getUserFromLocalCache().id;
    return this.httpClient.get<boolean>(`${environment.resourceServerUrl}/channel/is-user-in-channel?userId=${userId}&channelId=${channelId}`).toPromise();
  }

  getSubChannelsForUser(channelId: number, userId: number): Observable<Channel[]> {
    let params = new HttpParams();
    params = params.append('channelId', String(channelId));
    params = params.append('userId', String(userId));
    return this.httpClient.get<Channel[]>(
      environment.resourceServerUrl + '/channel/find-all-by-channel-and-user', {params});
  }
}
