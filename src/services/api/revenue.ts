/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from '@umijs/max';
import client from '..';

export const getListRevenueAPI = (params: { year: any }) => {
  return client.get('revenue/revenue-dashbroad', { params }).then((res: AxiosResponse) => res.data);
};

export const getListRevenueInvestAPI = (params: { schoolId: string; year: string | number }) => {
  return client.get('revenue/revenue-invest', { params }).then((res: AxiosResponse) => res.data);
};

export const getListRevenueInvestDetailAPI = (params: {
  schoolId: string;
  productId: string;
  year: string | number;
}) => {
  return client.get('revenue/revenue-invest-detail', { params }).then((res: AxiosResponse) => res.data);
};
