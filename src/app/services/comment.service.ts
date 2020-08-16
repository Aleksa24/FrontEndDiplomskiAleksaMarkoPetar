import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {CommentStatus} from "../model/CommentStatus";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  ORIGINAL: string = "Original";

  constructor(private httpClient: HttpClient) { }

   getCommentStatusByName(statusName: string): Promise<CommentStatus> {
    return this.httpClient.get<CommentStatus>(environment.apiUrl + "/comment/comment-status/" + statusName).toPromise();
  }
}
