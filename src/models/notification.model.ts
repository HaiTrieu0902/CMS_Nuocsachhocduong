import { IGetListParamCommon } from './common.model';

export interface INotification {
  id?: string;
  title: string;
  isRead: boolean;
  isReadAdmin: boolean;
  type: string;
  data?: {
    time: string;
    title: string;
  };
  createdAt?: string;
  updatedAt?: string;
  account?: {
    id: string;
    fullName: string;
    avatar: string;
  };
  receiver?: {
    id: string;
    fullName: string;
  };
}

export interface IGetListParamNotification extends IGetListParamCommon {
  receiverId?: string;
  accountId?: string;
}

export interface IDataNotification {
  createdAt: Date | any;
  updatedAt: Date | any;
  id: string;
  title: string;
  timeSend: Date | any;
  content: string;
  isDeleted: boolean;
  schools: School[];
}

export interface School {
  id: string;
  code: string;
  name: string;
  address: null | string;
}
