import { IGetListParamCommon } from '@/models/common.model';
import { INotification } from '@/models/notification.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListNotificationAPI = (params: IGetListParamCommon) => {
  return client.get('schedule-notification/get-list-schedule', { params }).then((res: AxiosResponse) => res.data);
};

export const getDetailNotificationAPI = (id: string) => {
  return client.get(`schedule-notification/detail/${id}`).then((res: AxiosResponse) => res.data);
};

export const createNotificationAPI = (params: INotification) => {
  return client.post('schedule-notification/create', params).then((res: AxiosResponse) => res.data);
};

export const updateNotificationAPI = (payload: INotification) => {
  const { id, ...rest } = payload;

  return client.put(`schedule-notification/update/${id}`, rest).then((res: AxiosResponse) => res.data);
};

export const deleteNotificationAPI = (id: string) => {
  return client.delete(`schedule-notification/delete/${id}`).then((res: AxiosResponse<any>) => res.data);
};
