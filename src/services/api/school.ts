import { IGetQuerySchool, ISchool } from '@/models/school.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListSchoolAPI = (payload: IGetQuerySchool) => {
  return client.get('school/get-list-school', { params: payload }).then((res: AxiosResponse) => res.data);
};

export const getDetailSchoolAPI = (id: string) => {
  return client.get(`school/get-detail-schhol/${id}`).then((res: AxiosResponse) => res.data);
};

export const createSchoolAPI = (params: ISchool) => {
  return client.post('school/create-school', params).then((res: AxiosResponse) => res.data);
};

export const updateSChoolAPI = (params: ISchool) => {
  return client.put(`school/update-school`, params).then((res: AxiosResponse) => res.data);
};

export const deleteSchoolAPI = (id: string) => {
  return client.delete(`school/delete-school/${id}`).then((res: AxiosResponse<any>) => res.data);
};
