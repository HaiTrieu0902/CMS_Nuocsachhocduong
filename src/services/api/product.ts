import { IGetListParamProduct, IProduct } from '@/models/product.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListProductAPI = (params: IGetListParamProduct) => {
  return client.get('product/get-list-product', { params }).then((res: AxiosResponse) => res.data);
};

export const getDetailProductAPI = (id: string) => {
  return client.get(`product/get-detail-product/${id}`).then((res: AxiosResponse) => res.data);
};

export const createProductAPI = (params: IProduct) => {
  return client.post('product/create-product', params).then((res: AxiosResponse) => res.data);
};

export const updateProductAPI = (params: IProduct) => {
  return client.put(`product/update-product`, params).then((res: AxiosResponse) => res.data);
};

export const deleteProductAPI = (id: string) => {
  return client.delete(`product/delete/${id}`).then((res: AxiosResponse<any>) => res.data);
};
