import { IGetListParamCommon } from './common.model';
export interface IAccount {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  schoolIds: string[];
  avatar: string;
  isDelete?: boolean;
  codeOTP?: null;
  dob: any | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  password?: string;
  role?: string;
  roleId?: string;
  schools?: {
    id: string;
    name: string;
  }[];
}

export interface IGetListParamsUser extends IGetListParamCommon {
  roleId?: string;
}
