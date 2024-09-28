import { IGetListParamCommon } from '@/models/common.model';
import { INews } from '@/models/news.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListNewsAPI = (params: IGetListParamCommon) => {
  return client.get('news/get-list-news', { params }).then((res: AxiosResponse) => res.data);
};

export const getDetailNewsAPI = (id: string) => {
  return client.get(`news/get-detail-news/${id}`).then((res: AxiosResponse) => res.data);
};

export const createNewsAPI = (params: INews) => {
  return client.post('news/create-news', params).then((res: AxiosResponse) => res.data);
};

export const updateNewsAPI = (params: INews) => {
  return client.put(`news/update-news`, params).then((res: AxiosResponse) => res.data);
};

export const deleteNewsAPI = (id: string) => {
  return client.delete(`news/delete-news/${id}`).then((res: AxiosResponse<any>) => res.data);
};
