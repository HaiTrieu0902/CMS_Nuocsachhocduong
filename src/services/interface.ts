export interface CommonResponse<T> {
  status: number;
  message: string;
  data: T;
}
