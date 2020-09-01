import {User} from "./User";
import {CommentStatus} from "./CommentStatus";
import {Like} from "./Like";
import {Attachment} from "./Attachment";
import {Post} from './Post';

export class Comment {
  public id:number;
  public text:string;
  public dateCreated:Date;
  public dateLastModified:Date;
  public user:User;
  public commentStatus:CommentStatus;
  public likes: Like[] = [];
  public attachments: Attachment[] = [];
  public comments:Comment[] = [];
  public post: Post;
  public filesToUpload;

}
