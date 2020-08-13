import {Category} from "./Category";
import {ChannelStatus} from "./ChannelStatus";
import {CommunicationDirection} from "./CommunicationDirection";
import {Attachment} from "./Attachment";
import {UserChannel} from "./UserChannel";
import {Post} from "./Post";

export class Channel{
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

}
