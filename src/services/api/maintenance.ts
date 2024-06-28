import { IGetListParamMaintenance, IMaintenance, IStatusMaintenance } from '@/models/maintenance.model';
import { AxiosResponse } from 'axios';
import client from '..';

export const getListMaintenanceAPI = (params: IGetListParamMaintenance) => {
  return client.get('maintenance/get-list-maintenance', { params }).then((res: AxiosResponse) => res.data);
};

export const getDetailMaintenanceAPI = (id: string) => {
  return client.get(`maintenance/get-detail-maintenance/${id}`).then((res: AxiosResponse) => res.data);
};

export const createMaintenanceAPI = (params: IMaintenance) => {
  return client.post('maintenance/create-maintenance', params).then((res: AxiosResponse) => res.data);
};

export const updateMaintenanceAPI = (params: IMaintenance) => {
  return client.put(`maintenance/update-maintenance`, params).then((res: AxiosResponse) => res.data);
};

export const updateStatusMaintenanceAPI = (params: IStatusMaintenance) => {
  return client.put(`maintenance/update-status-maintenance`, params).then((res: AxiosResponse) => res.data);
};

export const deleteMaintenanceAPI = (id: string) => {
  return client.delete(`maintenance/delete-maintenance/${id}`).then((res: AxiosResponse<any>) => res.data);
};
