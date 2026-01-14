import { User } from "./users";

export interface Team {
  id: string;
  name: string;
  leader?: User;
  leader_id: string;
  members?: User[]
}

export interface CreateTeamDTO {
  name: string;
  leader_id: string;
}