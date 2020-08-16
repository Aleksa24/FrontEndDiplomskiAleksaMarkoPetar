import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {CommentStatus} from "../model/CommentStatus";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Comment} from "../model/Comment";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  ORIGINAL: string = "Original";

  constructor(private httpClient: HttpClient,
              private authService: AuthenticationService) { }

   getCommentStatusByName(statusName: string): Promise<CommentStatus> {
    return this.httpClient.get<CommentStatus>(environment.apiUrl + "/comment/comment-status/" + statusName).toPromise();
  }
  getCommentById(id: number):Observable<Comment> {
    return this.httpClient.get<Comment>(environment.apiUrl+"/comment/"+id);
  }

  async postReplay(comment: Comment, replayText: string): Promise<Comment> {
    let replay:Comment = new Comment();
    replay.text = replayText;
    replay.user = this.authService.getUserFromLocalCache();

    await this.getCommentStatusByName(this.ORIGINAL).then((commentStatus) => {
      replay.commentStatus = commentStatus;
    });
    comment.comments.push(replay);
    return this.httpClient.post<Comment>(environment.apiUrl+"/comment/addReplay",comment).toPromise();
  }

}
