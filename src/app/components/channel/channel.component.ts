import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelService} from '../../services/channel.service';
import {ActivatedRoute} from '@angular/router';
import {Channel} from '../../model/Channel';
import {switchMap} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import {PostNewComponent} from "../post-new/post-new.component";
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit, OnDestroy {
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
    ).subscribe((value) => this.channel = value));
  }

  openNewPostDialog() {
    let refDialog = this.matDialog.open(PostNewComponent,{
      height:"500px",width:"400px"
    });

    refDialog.afterClosed().subscribe((post:Post) =>{
      if (post == undefined) return;
      this.subs.push(this.postService.savePost(this.channel,post)
        .subscribe((savedPost) => {
          console.log("kanal je primljen");
          this.channel.posts.push(savedPost);
      }));
    },(error => {
      console.dir(error);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe());
  }
}
