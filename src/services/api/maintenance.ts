import { ICreateMaintenance, IGetListMaintenance } from '@/models/maintenance.model';
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListMaintenanceAPI = (payload: IGetListMaintenance) => {
  return client.get('maintenance/get-list-maintenance', { params: payload }).then((res: AxiosResponse) => res.data);
};

export const createMaintenanceAPI = (payload: ICreateMaintenance) => {
  return client.post('maintenance/create', payload).then((res: AxiosResponse) => res.data);
};

export const updateMaintenanceAPI = (payload: ICreateMaintenance) => {
  const { id, ...rest } = payload;
  return client.put(`maintenance/update/${id}`, rest).then((res: AxiosResponse) => res.data);
};
