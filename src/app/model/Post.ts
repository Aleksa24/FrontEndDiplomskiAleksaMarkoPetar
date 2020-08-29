import {User} from "./User";
import {Channel} from "./Channel";
import {Like} from "./Like";
import {Comment} from "./Comment";
import {Attachment} from "./Attachment";

export class Post {
  public id: number;
  public title: string;
  public body: string;
  public dateCreated: Date;
  public user: User;
  public channel: Channel;
  public likes: Like[] = [];
  public comments: Comment[] = [];
  public attachments: Attachment[] = [];
  // files to upload
  public filesToUpload;
}
