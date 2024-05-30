import { IGetListParamCommon } from './common.model';
export interface IAccount {
  id?: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber: number;
  role: string;
  avatar: string;
  dob: string | undefined;
  schoolIds?: string | any;
  schools?: any[];
  isDeleted: boolean;
  updatedAt: string | Date;
  resetPasswordCode: string | undefined;
}

export interface IGetListParamsUser extends IGetListParamCommon {
  role?: string;
}

export interface IListUser {
  status: number;
  message: string;
  data: Array<IAccount[] | any[]>;
}
