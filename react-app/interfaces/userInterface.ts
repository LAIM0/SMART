export interface UserData {
  id: string;
  email: string;
}

export interface UserDataRanking {
  id: string;
  email: string;
  lastName: string;
  firstName: string;
  teamId: string;
  profilePicture: string;
  level: number;
  firstLogin: boolean;
}
