import { User } from "./users";

export interface Team {
  id: string;
  name: string;
  leader?: {
    id: string;
    name: string;
  };
  members?: User[]
}