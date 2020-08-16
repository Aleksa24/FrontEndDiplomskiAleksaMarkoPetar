import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Post} from "../model/Post";
import {Comment} from "../model/Comment";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {CommentStatus} from "../model/CommentStatus";
import {CommentService} from "./comment.service";
import {timeout} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private httpClient: HttpClient,
              private authService: AuthenticationService,
              private commentService: CommentService) { }

  getById(id: number):Observable<Post> {
    return this.httpClient.get<Post>(environment.apiUrl+"/post/"+id);
  }

  async postComment(post:Post,commentText:string):Promise<Post> {
    let comment: Comment = new Comment();
    comment.text = commentText;
    comment.user = this.authService.getUserFromLocalCache();
    await this.commentService.getCommentStatusByName(this.commentService.ORIGINAL)
      .then((recevedStatus) =>{
        comment.commentStatus = recevedStatus;
        console.log("odradio se getCOmmentStatusByName1")
    });
    console.log("odradio se getCOmmentStatusByName2")
    post.comments.push(comment);

    return this.httpClient.post<Post>(environment.apiUrl+"/post/addComment",post).toPromise();
  }


}
