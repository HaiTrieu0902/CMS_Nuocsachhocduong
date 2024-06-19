import { IGetListParamCommon } from './common.model';

export interface IProduct {
  id?: string;
  code: string;
  name: string;
  price: number;
  discount: number;
  isDelete: boolean;
  content: string;
  images: any[];
  categoryProduct?: {
    code: string;
    id: string;
    name: string;
  };
  createAt?: string | any;
  updatedAt?: string | any;
}

export interface IGetListParamProduct extends IGetListParamCommon {
  max?: string;
  min?: string;
  categoryProductId?: string;
}

export interface IListProduct {
  status: number;
  message: string;
  data: Array<IProduct[] | any[]>;
}
