import { IAccount, IGetListParamsUser } from '@/models/account.model';
import type { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListUserAPI = (params: IGetListParamsUser) => {
  return client.get('user/get-list-user', { params: params }).then((res: AxiosResponse<any>) => res.data);
};

export const getListUserBySchoolAPI = (id: string) => {
  return client.get(`user/get-user-schoolId/${id}`).then((res: AxiosResponse<any>) => res.data);
};

export const getDetailUserAPI = (id: string) => {
  return client.get(`user/get-profile/${id}`).then((res: AxiosResponse<any>) => res.data);
};

export const createAccountAPI = (params: IAccount) => {
  return client.post('user/create', params).then((res: AxiosResponse<any>) => res.data);
};

export const updateAccountAPI = (params: IAccount) => {
  const { id, ...rest } = params;
  return client.put(`user/update-user/${id}`, rest).then((res: AxiosResponse<any>) => res.data);
};

export const deleteUserAPI = (id: string) => {
  return client.delete(`user/delete/${id}`).then((res: AxiosResponse<any>) => res.data);
};
