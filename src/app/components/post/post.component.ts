import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";
import { Comment} from "../../model/Comment";

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

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.subs.push(this.postService.getById(this.post.id).subscribe((post) => {
      this.post=post;
      console.log({post})
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe())
  }

  commentButtonClicked() {
    this.isCommentOpen = !this.isCommentOpen;
    console.log(this.post.comments.length)
  }

  postComment(comment:string) {
      this.postService.postComment(this.post, comment)
        .then((post)=> {
          this.post = post;
          console.log("post: " + this.post.id)
          console.log("post: " + this.post.title)
        });
  }
}
