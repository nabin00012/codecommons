export interface Session {
  user: {
    id: string;
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  token: string;
  expires: Date;
}
