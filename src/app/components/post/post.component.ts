import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";
import { Comment} from "../../model/Comment";
import {User} from "../../model/User";
import {AuthenticationService} from "../../services/authentication.service";
import {userError} from "@angular/compiler-cli/src/transformers/util";
import {Like} from "../../model/Like";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnDestroy {

  post$: Observable<Post>;
  @Input()post: Post;
  subs: Subscription[] = [];
  isCommentOpen: boolean = false;
  isLiked: boolean = false;
  isDisliked: boolean = false;
  loggedUser: User;

  constructor(private postService: PostService,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromLocalCache();

    this.subs.push(this.postService.getById(this.post.id).subscribe((post) => {
      this.post=post;

      //prolazi da vidi da li je taj post lajkovan kod ulogovanog usera da bi obelezio slova
      for (let like of this.post.likes){
        if (like.user.id == this.loggedUser.id){
          if (like.likeStatus.name == this.postService.LIKE){
            this.isLiked = true;
            this.isDisliked = false;
            break;
          }
          if (like.likeStatus.name == this.postService.DISLIKE){
            this.isLiked = false;
            this.isDisliked = true;
            break;
          }
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe())
  }

  commentButtonClicked() {
    this.isCommentOpen = !this.isCommentOpen;
  }

  postComment(comment:string) {
      this.postService.postComment(this.post, comment)
        .then((post)=> {
          this.post = post;
        });
  }

  onDislike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
    this.postService.like(this.post,this.postService.DISLIKE)
      .then((post) => {
        this.post = post;
        this.isLiked = false;
        this.isLiked = true;
      });
    } else {
      //update like
      this.postService.updateLike(this.post,this.postService.DISLIKE,like)
        .then((post) => {
          this.post = post;
          this.isLiked = false;
          this.isDisliked = true;
        });
    }
  }

  onLike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (this.didUserAlreadyLikedOrDisliked() == null){
      this.postService.like(this.post,this.postService.LIKE)
        .then((post) => {
          this.post = post;
          this.isLiked = true;
          this.isDisliked = false;
        });
    } else {
      //update like
      this.postService.updateLike(this.post,this.postService.LIKE,like)
        .then((post) => {
          this.post = post;
          this.isLiked = true;
          this.isDisliked = false;
        });
    }

  }

  /**
   * like objekat: ako postoji lajk sa tim user-om
   * null: ako ne postoji lajk sa tim user-om
   */
  private didUserAlreadyLikedOrDisliked():Like {
    for (let like of this.post.likes){
      if (like.user.id == this.loggedUser.id){
        return like;
      }
    }
    return null;
  }
}
