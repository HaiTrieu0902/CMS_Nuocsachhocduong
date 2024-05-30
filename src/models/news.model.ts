export interface INews {
  id?: string;
  thumbnail: string | any;
  title: string;
  position: number;
  summary: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IListNews {
  status: number;
  message: string;
  data: Array<INews[] | any[]>;
}
