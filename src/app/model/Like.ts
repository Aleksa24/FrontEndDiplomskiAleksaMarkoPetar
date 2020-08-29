import {User} from "./User";
import {LikeStatus} from "./LikeStatus";
import {Post} from "./Post";
import {Comment} from "./Comment";

export class Like {
  public id: number;
  public dateCreated: Date;
  public likeStatus: LikeStatus;
  public user: User;
  public post: Post;
  public comment: Comment;
}
