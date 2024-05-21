import { IGetQuerySchool, Ischool } from '@/models/school.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListSchoolAPI = (payload: IGetQuerySchool) => {
  return client.get('school/get-list-school', { params: payload }).then((res: AxiosResponse) => res.data);
};

export const createSchoolAPI = (params: Ischool) => {
  return client.post('school/create', params).then((res: AxiosResponse) => res.data);
};
