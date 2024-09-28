import { IGetListParamNotification } from '@/models/notification.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListNotificationAPI = (params: IGetListParamNotification) => {
  return client.get('notification/get-list-notification', { params }).then((res: AxiosResponse) => res.data);
};

export const readNotificationAPI = (id: string) => {
  return client.put(`notification/read-notification/${id}`).then((res: AxiosResponse) => res.data);
};

export const deleteNotificationAPI = (id: string) => {
  return client.delete(`notification/delete-notification/${id}`).then((res: AxiosResponse) => res.data);
};
