import { IGetListParamCommon } from './common.model';

export interface IGetListMaintenance extends IGetListParamCommon {
  status?: string;
}

export interface IListMaintenance {
  status: number;
  message: string;
  data: Array<IMaintenance[] | any[]>;
}

export interface IMaintenance {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  title: string;
  reason: string;
  status: string;
  createdBy: string;
  dateAssigned: string | null;
  cause: string | null;
  solution: string | null;
  schoolId: string;
  assignedTo: null;
  images: {
    createdAt: string;
    updatedAt: string;
    id: string;
    url: string;
    typeMaintenance: string | null;
    productId: string | null;
    maintenanceId: string;
  }[];
  school: {
    name: string;
  };
  staff: {
    fullName: string;
  };
}

export interface ICreateMaintenance {
  id?: string;
  type: string;
  title: string;
  reason: string;
  schoolId: string;
  assignedTo: string;
  images: any[];
}
