import { IGetListParamCommon } from '@/models/common.model';
import client from '..';
import { CommonResponse } from '../interface';

export interface ICreateContractParams {
  code: string;
  signDate: string;
  schoolId: string;
  categoryContractId: string;
  files: string[];
}

interface ICreateContractResponse {
  code: string;
  signDate: string;
  schoolId: string;
  categoryContractId: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface File {
  createdAt: string;
  updatedAt: string;
  id: string;
  url: string;
  typeMaintenance: any;
  productId: any;
  contractId: string;
  maintenanceId: any;
}

export interface ICategory {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  name: string;
}

export interface IContract {
  createdAt: string;
  updatedAt: string;
  id: string;
  code: string;
  signDate: string;
  schoolId: string;
  categoryContractId: string;
  files: File[];
  category: ICategory;
}

export interface IGetListContractParams extends IGetListParamCommon {
  schoolId: string;
}

export const createContractAPI = (params: ICreateContractParams) => {
  return client
    .post<CommonResponse<ICreateContractResponse>>('contract/create', params)
    .then((res) => res.data);
};

export const getListContractAPI = (params: IGetListContractParams) => {
  const { schoolId, ...rest } = params;
  return client
    .get<CommonResponse<[IContract[], number]>>(`contract/get-list-contract/${schoolId}`, {
      params: rest,
    })
    .then((res) => res.data.data);
};
