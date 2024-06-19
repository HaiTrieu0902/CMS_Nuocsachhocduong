import { IDataCommon, IGetListParamCommon } from '@/models/common.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListCategoryAPI = (payload: IGetListParamCommon) => {
  return client.get('category/get-list-category-product', { params: payload }).then((res: AxiosResponse) => res.data);
};

export const addCategoryAPI = (params: IDataCommon) => {
  return client.post('category/create-category-product', params).then((res: AxiosResponse) => res.data);
};

export const updateCategoryAPI = (params: IDataCommon) => {
  return client.put(`category/update-category-product`, params).then((res: AxiosResponse) => res.data);
};

export const deleteCategoryProductAPI = (id: string) => {
  return client.delete(`category/delete-category-product/${id}`).then((res: AxiosResponse<any>) => res.data);
};
