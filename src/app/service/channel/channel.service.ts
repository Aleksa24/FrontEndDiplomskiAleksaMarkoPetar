import {Injectable} from '@angular/core';
import {Channel} from '../../model/Channel';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Post} from '../../model/Post';
import {AuthenticationService} from '../authentication/authentication.service';
import {User} from '../../model/User';
import {Attachment} from '../../model/Attachment';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  public host = environment.resourceServerUrl;

  constructor(private httpClient: HttpClient) {
  }

  getChannelsForUser(id: number): Observable<Channel[]> {
    return this.httpClient.get<Channel[]>(environment.resourceServerUrl + `/channel/findAllByUserId?id=${id}`);
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
}