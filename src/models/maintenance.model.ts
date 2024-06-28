import { IGetListParamCommon } from './common.model';

export interface IMaintenance {
  id?: string;
  categoryMaintenanceId: string;
  accountId: string;
  staffId?: string;
  installRecordId: string;
  schoolId: string;
  statusId: string;
  title: string;
  reason: string;
  repairFees?: number;
  timeMaintenance?: Date | any;
  images_request: any[];
  images_response?: any[];
  isDelete?: boolean;

  // get list
  createdAt?: Date | any;
  updatedAt?: Date | any;
  categoryMaintenance?: CategoryMaintenance;
  installRecord?: InstallRecord;
  school?: School;
  account?: Account;
  staff?: Account;
  status?: CategoryMaintenance;
}

export interface Account {
  id: string;
  fullName: string;
  avatar: string;
}

export interface CategoryMaintenance {
  id: string;
  name: string;
}

export interface InstallRecord {
  id: string;
  timeInstall: Date;
  warrantyPeriod: number;
  product: Product;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  images: string[];
  discount: number;
}

export interface School {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface IGetListParamMaintenance extends IGetListParamCommon {
  categoryMaintenanceId?: string;
  accountId?: string;
  installRecordId?: string;
  staffId?: string;
  schoolId?: string;
  statusId?: string;
  isDelete?: boolean;
}

export interface IStatusMaintenance {
  id?: string;
  statusId?: string;
  staffId?: string;
  role?: string;
}
