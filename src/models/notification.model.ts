export interface INotification {
  id?: string;
  title: string;
  timeSend: string | any;
  content: string;
  schoolIds: any[];
}

export interface INotificationList {
  status: number;
  message: string;
  data: Array<IDataNotification[] | number>;
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
