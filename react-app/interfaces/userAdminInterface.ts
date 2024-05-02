interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  teamId: string;
  isAdmin: boolean;
  passWordInitialized: boolean;
}

export default User;
