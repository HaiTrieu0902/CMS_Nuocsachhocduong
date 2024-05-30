import { IGetListParamProduct, IProduct } from '@/models/product.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListProductAPI = (params: IGetListParamProduct) => {
  return client.get('product/get-list-product', { params }).then((res: AxiosResponse) => res.data);
};

export const getDetailProductAPI = (id: string) => {
  return client.get(`product/get-product/${id}`).then((res: AxiosResponse) => res.data);
};

export const createProductAPI = (params: IProduct) => {
  return client.post('product/create', params).then((res: AxiosResponse) => res.data);
};

export const updateProductAPI = (params: IProduct, id: string) => {
  return client.post(`product/update-product/${id}`, params).then((res: AxiosResponse) => res.data);
};
