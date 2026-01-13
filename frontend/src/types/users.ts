export interface User {
  id: string;
  name: string;
  email: string;
  team: string;
  team_id: string;
  is_active: boolean;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  team_id: string;
  is_active: boolean;
}