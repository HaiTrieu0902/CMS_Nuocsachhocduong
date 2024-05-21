export interface IUser {
  email: string;
  password: string;
}

export interface IChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface ResponseAuthAPI {
  status: number;
  message: string;
  data: IAuth;
}

export interface IAuth {
  createdAt: Date | string;
  updatedAt: Date | string;
  id: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  fullName: string;
  avatar: string;
  resetPasswordCode: string;
  dob: string;
  isDeleted: boolean;
  token: string;
}
