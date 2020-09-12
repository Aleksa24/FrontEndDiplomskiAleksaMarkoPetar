import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelService} from '../../../service/channel/channel.service';
import {ActivatedRoute} from '@angular/router';
import {Channel} from '../../../model/Channel';
import {switchMap} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PostNewComponent} from '../../post/post-new/post-new.component';
import {Post} from '../../../model/Post';
import {PostService} from '../../../service/post/post.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy, AfterViewChecked {

  channel$: Observable<Channel>;
  channel: Channel;
  subs: Subscription[] = [];

  constructor(private channelService: ChannelService,
              private postService: PostService,
              private route: ActivatedRoute,
              private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subs.push(this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return this.channelService.getById(parseInt(id));
      })
    ).subscribe((value) => {
      value.posts.sort((postA, postB) =>postA.dateCreated>postB.dateCreated ? -1:1);
      this.channel = value;

      setTimeout(() => {
        let postIdForNavigation = this.postService.getPostIdForNavigation();
        if (postIdForNavigation>0){
          document.getElementById(String(postIdForNavigation)).scrollIntoView();
          this.postService.savePostIdForNavigation(-1);
        }
      },750)
    }));
  }

  ngAfterViewChecked(): void {
    setTimeout(() => {
      let postIdForNavigation = this.postService.getPostIdForNavigation();
      if (postIdForNavigation>0){
        document.getElementById(String(postIdForNavigation)).scrollIntoView();
        this.postService.savePostIdForNavigation(-1);
      }
    },3000)
  }

  openNewPostDialog() {
    let refDialog = this.matDialog.open(PostNewComponent, {
      height: '500px', width: '400px'
    });

    refDialog.afterClosed().subscribe((result) => {
      if (result === undefined) {
        return;
      }
      const post: Post = new Post();
      post.title = result.title;
      post.body = result.body;
      this.subs.push(this.postService.savePost(this.channel, post)
        .subscribe((savedPost) => {
          savedPost.filesToUpload = result.files; // files that were chosen while new post is created
          this.channel.posts.unshift(savedPost);
        }));
    }, (error => {
      console.dir(error);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }

  addSubchannel() {
    console.log(this.channel);
  }
}
