import { IAuth, IChangePassword, IUser, ResponseAuthAPI } from '@/models/auth.model';
import type { AxiosResponse } from '@umijs/max';
import client from '..';

export const loginAPI = (params: IUser) => {
  return client.post('auth/login', params).then((res: AxiosResponse<ResponseAuthAPI>) => res.data);
};

export const changePasswordAPI = (params: IChangePassword) => {
  return client.put('user/change-password', { ...params }).then((res: AxiosResponse<IAuth>) => res.data);
};

// export const requestOTPChangePassword = () => {
//   return client.get('admin/requestOTPChangePassword').then((res: AxiosResponse) => res.data);
// };
