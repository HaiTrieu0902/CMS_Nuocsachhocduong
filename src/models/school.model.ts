export interface IGetQuerySchool {
  size: number;
  page: number;
  search?: string | undefined;
  filter?: string | undefined;
  sort?: string | undefined;
}

export interface IListSchool {
  status: number;
  message: string;
  data: Array<Ischool[] | any[]>;
}

export interface Ischool {
  id?: string;
  code: string;
  name: string;
  dateContract: string;
  description: string;
  contract?: string;
  address?: string;
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
