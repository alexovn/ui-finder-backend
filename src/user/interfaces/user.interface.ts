export interface User {
  id: string;
  email: string;
  password: string;
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
