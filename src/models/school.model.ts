import { IGetListParamCommon } from './common.model';

export interface IGetQuerySchool extends IGetListParamCommon {
  accountId?: string;
}

export interface ISchool {
  id?: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  isDelete: boolean;
  createdAt?: Date | any;
  updatedAt?: Date | any;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

/**REVENUE */

export interface IGetQueryRevenueSchool extends IGetQuerySchool {
  startDate?: string | any;
  endDate?: string | any;
  schoolId?: string;
}

export interface IRevenueSchool {
  time: string | any;
  numberStudent: number;
  cost: number;
  schoolId: string;
  school?: {
    id: string;
    name: string;
  };
  id?: string;
  createdAt?: string | Date | any;
  updatedAt?: string | Date;
}

export interface IRevenueSchoolList {
  status: number;
  message: string;
  data: DataRevenue;
}

export interface DataRevenue {
  selectedRevenue: Array<IRevenueSchool[] | number>;
  totalAmount: number;
}
