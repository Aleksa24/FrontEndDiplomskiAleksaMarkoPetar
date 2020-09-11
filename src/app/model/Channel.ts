import {Category} from './Category';
import {ChannelStatus} from './ChannelStatus';
import {CommunicationDirection} from './CommunicationDirection';
import {Attachment} from './Attachment';
import {UserChannel} from './UserChannel';
import {Post} from './Post';
import {Searchable} from "./Searchable";

export class Channel implements Searchable{

  public id: number;
  public name: string;
  public dateCreated: Date;
  public category: Category;
  public channelStatus: ChannelStatus;
  public communicationDirection: CommunicationDirection;
  public channels: Channel[] = [];
  public attachments: Attachment[] = [];
  public userChannels: UserChannel[] = [];
  public posts: Post[] = [];
  public parentChannel: Channel;

  public profilePicture;

  getText(): string {
    return `${this.name}, channel`;
  }
  type():Channel {
    return this;
  }
  toString():string{
    return `${this.name}, channel`;
  }
  getId(): number {
    return this.id;
  }
}
