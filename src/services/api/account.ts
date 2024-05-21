import { IAccount } from '@/models/account.model';
import type { AxiosResponse } from '@umijs/max';
import client from '..';

export const createAccountAPI = (params: IAccount) => {
  return client.post('user/create', params).then((res: AxiosResponse<any>) => res.data);
};
