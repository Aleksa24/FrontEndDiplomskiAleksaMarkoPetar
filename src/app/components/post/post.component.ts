import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnDestroy {

  $post: Observable<Post>;
  @Input()post: Post;
  subs: Subscription[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe())
  }

}
