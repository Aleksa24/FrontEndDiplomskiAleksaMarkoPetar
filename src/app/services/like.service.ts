import { Injectable } from '@angular/core';
import {Post} from "../model/Post";
import {Attachment} from "../model/Attachment";
import {Observable} from "rxjs";
import {HttpResponse} from "../model/HttpResponse";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Like} from "../model/Like";

@Injectable({
  providedIn: 'root'
})
export class LikeService {

  constructor(private httpClient: HttpClient) { }

  deleteLike(like: Like):Promise<HttpResponse> {
    return this.httpClient.delete<HttpResponse>(`${environment.apiUrl}/like/deleteLike/${like.id}`).toPromise();
  }
}
