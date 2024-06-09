import { IDataCommon, IGetListParamCommon } from '@/models/common.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListCategoryAPI = (payload: IGetListParamCommon & { type: string }) => {
  return client.get('category/get-list-category', { params: payload }).then((res: AxiosResponse) => res.data);
};

export const addCategoryAPI = (params: IDataCommon) => {
  return client.post('category/create', params).then((res: AxiosResponse) => res.data);
};

export const updateCategoryAPI = (params: IDataCommon) => {
  const { id, ...rest } = params;
  return client.put(`category/update/${id}`, rest).then((res: AxiosResponse) => res.data);
};

export const deleteCategoryProductAPI = (id: string) => {
  return client.delete(`category/delete-product/${id}`).then((res: AxiosResponse<any>) => res.data);
};

export const deleteCategoryContractAPI = (id: string) => {
  return client.delete(`category/delete-contract/${id}`).then((res: AxiosResponse<any>) => res.data);
};
