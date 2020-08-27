import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, range, Subscription} from "rxjs";
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";
import {User} from "../../model/User";
import {AuthenticationService} from "../../services/authentication.service";
import {Like} from "../../model/Like";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Attachment} from '../../model/Attachment';

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
  fileList: FileList;
  fileForm: FormGroup;

  constructor(private postService: PostService,
              private authService: AuthenticationService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromLocalCache();

    //kreiranje forme za slanje fajla
    this.fileForm = this.fb.group({
      file:[''],
      userId:[this.loggedUser.id,Validators.required],
      postId:[this.post.id,Validators.required]
    })

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
    if (like == null){
    this.postService.like(this.post,this.postService.DISLIKE)
      .then((post) => {
        this.post = post;
        this.isLiked = false;
        this.isLiked = true;
      });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.postService.DISLIKE) {
        this.postService.deleteLike(this.post,like)
          .then((post) => {
            this.isDisliked = false;
            this.post = post;
          });
      }else
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
    if (like == null){
      this.postService.like(this.post,this.postService.LIKE)
        .then((post) => {
          this.post = post;
          this.isLiked = true;
          this.isDisliked = false;
        });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.postService.LIKE) {
        this.postService.deleteLike(this.post,like)
          .then((post) => {
            this.isLiked = false;
            this.post = post;
          });
      }else
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

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.fileForm.get("file").value);
    formData.append('userId', this.fileForm.get("userId").value);
    formData.append('postId', this.fileForm.get("postId").value);

    this.subs.push(this.postService.addAttachment(formData).subscribe(
      (attachment) => {
        this.post.attachments.push(attachment);
      }, error =>{
        //todo:obraditi kada fajl vec postoji
        console.dir(error);
      }
    ));
  }

  detectFiles(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileForm.get('file').setValue(file);
    }
  }


  onDeleteUpload(attachment: Attachment): void{
    this.postService.removeAttachment(this.post, attachment).subscribe(
      data => {
        console.log(data);
      }
    );
  }

  onDeleteAttachment(attachment: Attachment): void {
    this.post.attachments = this.post.attachments.filter(value => value.id !== attachment.id);
    console.log(this.post.attachments);
  }
}
