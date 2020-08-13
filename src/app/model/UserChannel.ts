import {User} from "./User";
import {ChannelRole} from "./ChannelRole";

export class UserChannel {
  public id:number;
  public dateJoined:Date;
  public channelRole:ChannelRole;
  public user:User;
}
