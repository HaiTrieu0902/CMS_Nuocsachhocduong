import { IGetListParamCommon } from './common.model';

export interface IProduct {
  id?: string;
  code: string;
  name: string;
  cost: number;
  discountPer: number;
  content: string;
  categoryId: string;
  images: any[];
  category?: {
    createdAt: string;
    updatedAt: string;
    id: string;
    name: string;
  };
}

export interface IGetListParamProduct extends IGetListParamCommon {
  max?: string;
  min?: string;
  categoryId?: string;
}

export interface IListProduct {
  status: number;
  message: string;
  data: Array<IProduct[] | any[]>;
}
