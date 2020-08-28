import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, range, Subscription, throwError} from 'rxjs';
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";
import {User} from "../../model/User";
import {AuthenticationService} from "../../services/authentication.service";
import {Like} from "../../model/Like";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Attachment} from '../../model/Attachment';
import {HttpEventType} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {randomBytes} from 'crypto';

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
  filesToUpload = [];

  constructor(private postService: PostService,
              private authService: AuthenticationService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromLocalCache();

    if (this.post.filesToUpload !== undefined && this.post.filesToUpload.length > 0){
      this.filesToUpload = this.post.filesToUpload;
      // if, when post was created, files for uploading were selecred, puts that files in filesToUpload queue
    }
    //kreiranje forme za slanje fajla
    this.fileForm = this.fb.group({
      file:['']
    })

    this.subs.push(this.postService.getById(this.post.id).subscribe((post) => {
      this.post=post;
      this.onUpload(); // emits the event onUpload in case there are files to be uploaded
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

  uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', String(this.loggedUser.id));
    formData.append('postId', String(this.post.id));

    // this.subs.push(this.postService.addAttachment(formData).subscribe(
    //   (attachment) => {
    //     this.post.attachments.push(attachment);
    //   }, error =>{
    //     console.dir(error);
    //   }
    // ));
    const dummyAttachment: Attachment = new Attachment();
    dummyAttachment.uploadComplete = false;
    dummyAttachment.originalName = file.name;
    dummyAttachment.uploadProgress = 0;
    this.post.attachments.push(dummyAttachment);
    this.postService.addAttachment(formData).pipe(
      map((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          dummyAttachment.uploadProgress = Math.round((100 / event.total) * event.loaded);
        } else if (event.type === HttpEventType.Response) {
          this.post.attachments = this.post.attachments.filter(att => att.originalName !== file.name);
          const uploadedAttachment: Attachment = event.body;
          uploadedAttachment.uploadComplete = true;
          this.post.attachments.push(uploadedAttachment);
        }
      }),
      catchError((err: any) => {
        dummyAttachment.originalName = err.error;
        dummyAttachment.uploadProgress = 0;
        dummyAttachment.uploadError = true;
        setTimeout(() => {
          this.post.attachments = this.post.attachments.filter(att => att.originalName !== err.error);
        }, 3000);
        return throwError(err.message);
      })
    ).toPromise().then(
      (value => {
        console.log(value);
      }),
      (error => {
        console.log(error);
      })
    );
  }

  detectFiles(event) {
    this.filesToUpload = [];
    if (event.target.files.length > 0) {
      for (const file of event.target.files){
        this.filesToUpload.push(file);
      }
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

  onUpload(): void {
    if (this.filesToUpload.length > 0){
      this.filesToUpload.forEach(file => this.uploadFile(file));
    }
  }

}
