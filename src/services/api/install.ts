import { IGetListParamInstall, IInstall } from '@/models/install.model';

import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListInstallAPI = (params: IGetListParamInstall) => {
  return client.get('install/get-list-install', { params }).then((res: AxiosResponse) => res.data);
};

export const getDetailInstallAPI = (id: string) => {
  return client.get(`install/get-detail-install/${id}`).then((res: AxiosResponse) => res.data);
};

export const updateInstallAPI = (params: IInstall) => {
  return client.put(`install/update-install`, params).then((res: AxiosResponse) => res.data);
};

// export const deleteInstallAPI = (id: string) => {
//   return client.delete(`install/delete-install/${id}`).then((res: AxiosResponse<any>) => res.data);
// };
