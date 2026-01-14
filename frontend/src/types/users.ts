import { Team } from "./teams";

export interface User {
  id: string;
  name: string;
  email: string;
  team: Team;
  leader_of?: Team;
  team_id: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  team_id: string;
}