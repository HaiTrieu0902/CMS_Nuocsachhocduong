export interface INews {
  id?: string;
  thumbnail?: string | any;
  title?: string;
  type?: boolean;
  summary?: string;
  content?: string;
  user?: {
    id?: string;
    fullName: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
  accountId?: string;
}
