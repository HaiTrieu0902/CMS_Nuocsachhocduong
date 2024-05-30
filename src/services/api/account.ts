import { IAccount, IGetListParamsUser } from '@/models/account.model';
import type { AxiosResponse } from '@umijs/max';
import client from '..';

export const createAccountAPI = (params: IAccount) => {
  return client.post('user/create', params).then((res: AxiosResponse<any>) => res.data);
};

export const getListUserAPI = (params: IGetListParamsUser) => {
  return client.get('user/get-list-user', { params: params }).then((res: AxiosResponse<any>) => res.data);
};
