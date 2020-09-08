import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CommunicationDirection} from '../../model/CommunicationDirection';

@Injectable({
  providedIn: 'root'
})
export class CommunicationDirectionService {

  constructor(private httpClient: HttpClient) {}

  getCommunicationDirections(): Observable<CommunicationDirection[]>{
    return this.httpClient.get<CommunicationDirection[]>(
      environment.resourceServerUrl+"/communication-direction/all");
  }
}
