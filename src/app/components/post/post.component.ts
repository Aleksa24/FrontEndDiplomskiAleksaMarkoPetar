import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, of, range, Subscription, throwError} from 'rxjs';
import {Post} from "../../model/Post";
import {PostService} from "../../services/post.service";
import {User} from "../../model/User";
import {AuthenticationService} from "../../services/authentication.service";
import {Like} from "../../model/Like";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Attachment} from '../../model/Attachment';
import {HttpEventType} from '@angular/common/http';
import {catchError, map, takeWhile} from 'rxjs/operators';
import {randomBytes} from 'crypto';
import {UserService} from "../../services/user.service";
import {LikeService} from "../../services/like.service";
import {faPaperclip} from '@fortawesome/free-solid-svg-icons';
import {AttachmentService} from '../../services/attachment.service';
import {AttachmentUploadData} from '../../model/AttachmentUploadData';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit,OnDestroy {

  post$: Observable<Post>;
  @Input()post: Post;
  @Output()favouriteClick = new EventEmitter<Post>();
  subs: Subscription[] = [];
  isCommentOpen: boolean = false;
  isLiked: boolean = false;
  isDisliked: boolean = false;
  loggedUser: User;
  fileList: FileList;
  fileForm: FormGroup;
  filesToUploadPost = [];
  filesToUploadComment = [];
  faUpload = faPaperclip;
  isFavourite: boolean = false;

  constructor(private postService: PostService,
              private attachmentService: AttachmentService,
              private authService: AuthenticationService,
              private userService: UserService,
              private likeService: LikeService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.getUserFromLocalCache();

    if (this.post.filesToUpload !== undefined && this.post.filesToUpload.length > 0){
      this.filesToUploadPost = this.post.filesToUpload;
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
      //prolazi kroz favourite postove i gleda dal je ovaj jedan od njih
      if (this.loggedUser.favorites.find((post) => post.id == this.post.id) === undefined) {
        this.isFavourite = false;
      }else this.isFavourite = true;
    }));

  }

  ngOnDestroy(): void {
    this.subs.forEach(value => value.unsubscribe())
  }

  commentButtonClicked() {
    this.isCommentOpen = !this.isCommentOpen;
  }

  postComment(comment:string) {
    if (comment == null || comment.length==0){
      return
    }
      this.postService.postComment(this.post, comment)
        .then((post)=> {
          this.post = post;
        });
  }

  onDislike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (like == null){
    this.likeService.like(this.likeService.POST,this.post.id,this.likeService.DISLIKE)
      .then((value) => {
        this.post.likes.push(value);
        this.isLiked = false;
        this.isDisliked = true;
      });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.postService.DISLIKE) {
        this.likeService.deleteLike(like)
          .then((httpResponse) => {
            this.isDisliked = false;
            this.post.likes = this.post.likes.filter(value => value.id != like.id);
          });
      }else
      //update like
      this.likeService.updateLike(like,this.likeService.DISLIKE)
        .then((value) => {
          this.post.likes = this.post.likes.filter(_like => _like.id != like.id);
          this.post.likes.push(value);
          this.isLiked = false;
          this.isDisliked = true;
        });
    }
  }

  onLike(): void {
    let like: Like = this.didUserAlreadyLikedOrDisliked();
    if (like == null){
      this.likeService.like(this.likeService.POST,this.post.id,this.likeService.LIKE)
        .then((value) => {
          // this.post = post;
          this.post.likes.push(value);
          this.isLiked = true;
          this.isDisliked = false;
        });
    } else {
      //ovaj if je slucaj kada kliknes na like koji je vec kliknut
      if (like.likeStatus.name == this.postService.LIKE) {
        this.likeService.deleteLike(like)
          .then((httpResponse) => {
            this.isLiked = false;
            this.post.likes = this.post.likes.filter(value => value.id != like.id);
          });
      }else
      //update like
      this.likeService.updateLike(like,this.likeService.LIKE)
        .then((value) => {
          this.post.likes = this.post.likes.filter(_like => _like.id != like.id);
          this.post.likes.push(value);
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
    formData.append('attachmentParentId', String(this.post.id));
    formData.append('attachmentParentName', 'POST');
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
    this.attachmentService.add(formData).pipe(
      map((event: any) => {
        if (dummyAttachment.uploadAborted){
          throw new Error('UPLOAD_ABORTED');
        }
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
        let dummyAttachmentRemoveName: string;
        if (dummyAttachment.uploadAborted){
          dummyAttachmentRemoveName = err.message;
        }else{
          dummyAttachmentRemoveName = err.error;
          dummyAttachment.uploadProgress = 0;
          dummyAttachment.uploadError = true;
        }
        dummyAttachment.originalName = dummyAttachmentRemoveName;
        setTimeout(() => {
          this.post.attachments = this.post.attachments.filter(att => att.originalName !== dummyAttachmentRemoveName);
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
    this.filesToUploadPost = [];
    if (event.target.files.length > 0) {
      for (const file of event.target.files){
        this.filesToUploadPost.push(file);
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
    if (this.filesToUploadPost.length > 0){
      this.filesToUploadPost.forEach(file => this.uploadFile(file));
    }
  }


  favourite() {
    if (this.isFavourite){//ako jeste favourite onda mora da se izbaci
      this.subs.push(this.userService.addFavourite(this.post,this.userService.REMOVE)
        .subscribe((user) => {
          this.loggedUser = user;
          this.authService.saveUserToLocalCache(user);
          this.isFavourite = !this.isFavourite;
          this.favouriteClick.emit(this.post);
        }));
    }else
    this.subs.push(this.userService.addFavourite(this.post,this.userService.ADD)
      .subscribe((user)=> {
        this.authService.saveUserToLocalCache(user);
        this.loggedUser = user;
        this.isFavourite = !this.isFavourite;
        this.favouriteClick.emit(this.post);
      }));
  }

  getLikesNumber() {
    return this.post.likes.filter(value => value.likeStatus.name == this.likeService.LIKE).length;
  }
  getDislikeNumber() {
    return this.post.likes.filter(value => value.likeStatus.name == this.likeService.DISLIKE).length;
  }

  getSelectedFileNames(): string {
    let result = '';
    this.filesToUploadPost.forEach(file => result += file.name + ' \n');
    return result;
  }
}
