import { IGetListParamCommon } from '@/models/common.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListCategoryAPI = (payload: IGetListParamCommon) => {
  return client.get('category/get-list-category', { params: payload }).then((res: AxiosResponse) => res.data);
};

export const addCategoryAPI = (params: { name: string }) => {
  return client.post('category/create', params).then((res: AxiosResponse) => res.data);
};
