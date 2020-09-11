import {User} from "./User";
import {Channel} from "./Channel";
import {Like} from "./Like";
import {Comment} from "./Comment";
import {Attachment} from "./Attachment";
import {Searchable} from "./Searchable";

export class Post implements Searchable{
  public id: number;
  public title: string;
  public body: string;
  public dateCreated: Date;
  public user: User;
  public channel: Channel;
  public likes: Like[] = [];
  public comments: Comment[] = [];
  public attachments: Attachment[] = [];
  public filesToUpload;

  getText(): string {
    return `${this.title}, post`;
  }

  type(): Post {
    return this;
  }
  toString():string{
    return `${this.title}, post`;
  }

  getId(): number {
    return this.id;
  }
}
