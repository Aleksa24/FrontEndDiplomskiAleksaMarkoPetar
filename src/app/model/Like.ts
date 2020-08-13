import {User} from "./User";
import {LikeStatus} from "./LikeStatus";

export class Like {
  public id: number;
  public dateCreated: Date;
  public likeStatus: LikeStatus;
  public user: User;
}
