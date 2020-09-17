import {User} from './User';
import {ChannelRole} from './ChannelRole';
import {Channel} from './Channel';

export class UserChannel {
  public id: number;
  public dateJoined: Date;
  public channelRole: ChannelRole;
  public user: User;
  public channel: Channel;
}
