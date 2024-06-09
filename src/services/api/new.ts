import { IGetListParamCommon } from '@/models/common.model';
import { INews } from '@/models/news.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListNewsAPI = (params: IGetListParamCommon) => {
  return client.get('news/get-list-news', { params }).then((res: AxiosResponse) => res.data);
};

export const getDetailNewsAPI = (id: string) => {
  return client.get(`news/get-news/${id}`).then((res: AxiosResponse) => res.data);
};

export const createNewsAPI = (params: INews) => {
  return client.post('news/create', params).then((res: AxiosResponse) => res.data);
};

export const updateNewsAPI = (params: INews, id: string) => {
  return client.put(`news/update-news/${id}`, params).then((res: AxiosResponse) => res.data);
};

export const deleteNewsAPI = (id: string) => {
  return client.delete(`news/delete/${id}`).then((res: AxiosResponse<any>) => res.data);
};
