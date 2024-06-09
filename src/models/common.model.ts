import { TablePaginationConfig } from 'antd';

export interface IGetListParamCommon {
  size: number;
  page: number;
  search?: string | undefined;
  sort?: string | undefined;
}

export interface IDataCommon {
  id?: string;
  name: string;
  code?: string;
  type?: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
}
