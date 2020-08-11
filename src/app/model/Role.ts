import {UserPermission} from "./UserPermission";

export class Role {
  public id: number;
  public name: string;
  public userPermissions: UserPermission[] = [];
}
