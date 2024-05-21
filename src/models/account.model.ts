export interface IAccount {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: number;
  role: string;
  avatar: string;
  dob: string | undefined;
  school?: string;
}
