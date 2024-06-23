import { IGetQueryRevenueSchool, IGetQuerySchool, IRevenueSchool, ISchool } from '@/models/school.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListSchoolAPI = (payload: IGetQuerySchool) => {
  return client.get('school/get-list-school', { params: payload }).then((res: AxiosResponse) => res.data);
};

export const createSchoolAPI = (params: ISchool) => {
  return client.post('school/create', params).then((res: AxiosResponse) => res.data);
};

/*** REVENUE  */
export const getListRevenueSchoolAPI = (params: IGetQueryRevenueSchool) => {
  return client
    .get('revenue/get-list-revenue', {
      params: { ...params, sort: { field: 'time', order: 'ASC' } },
    })
    .then((res: AxiosResponse) => res.data);
};

export const createRevenueSchoolAPI = (params: IRevenueSchool) => {
  return client.post('revenue/create', params).then((res: AxiosResponse) => res.data);
};

export const updateRevenueSchoolAPI = (params: IRevenueSchool, id: string) => {
  return client.put(`revenue/update/${id}`, params).then((res: AxiosResponse) => res.data);
};

export const deleteRevenueSchoolAPI = (id: string) => {
  return client.delete(`revenue/delete/${id}`).then((res: AxiosResponse<any>) => res.data);
};
