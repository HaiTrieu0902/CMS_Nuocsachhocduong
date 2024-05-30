export interface IGetQuerySchool {
  size: number;
  page: number;
  search?: string | undefined;
  filter?: string | undefined;
  sort?: string | undefined;
}

export interface IListSchool {
  status: number;
  message: string;
  data: Array<Ischool[] | any[]>;
}

export interface Ischool {
  id?: string;
  code: string;
  name: string;
  dateContract: string;
  description: string;
  contract?: string;
}
