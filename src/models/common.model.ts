import { TablePaginationConfig } from 'antd';

export interface IGetListParamCommon {
  pageSize: number;
  page: number;
  search?: string | undefined;
  sortBy?: string | undefined;
  sortOrder?: string | undefined;
}

export interface IDataCommon {
  id?: string;
  name: string;
  code?: string;
  type?: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
}
