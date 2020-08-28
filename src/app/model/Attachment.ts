import {User} from "./User";

export class Attachment {
  public id:number;
  public url:string;
  public user:User;
  public originalName:string;
  // data for upload tracking
  public uploadComplete = true;
  public uploadProgress: number;
  public uploadError = false;
  public uploadAborted = false;

}
