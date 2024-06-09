import client from '..';
import { CommonResponse } from '../interface';

export interface IOverallData {
  staffs: number;
  schools: number;
  totalAmount: number;
  dataChart: DataChart[];
}

export interface DataChart {
  total: number;
  month: number;
}

export const getOverallDataAPI = (year: string) => {
  return client
    .get<CommonResponse<IOverallData>>('dashboard/revenue', { params: { year } })
    .then((res) => res.data.data);
};
