/* eslint-disable @typescript-eslint/no-unused-vars */
import { TablePaginationConfig } from 'antd';
import { ESTATUS } from './enum';

export const DEFAULT_SIZE_PAGE = 10;
export const DEFAULT_SIZE_PAGE_MAX = 1000;

export const DEFAULT_PAGE_NUMBER = 1;

export const TYPES_ACCOUNT = [
  {
    value: '96e3ba98-368c-4509-baf2-9033d2b1a10e',
    label: 'Quản trị viên',
  },
  {
    value: '5554872b-ee57-497a-b9fc-d2c3cd08bcb7',
    label: 'Quản lý thiết bị trường học',
  },
  {
    value: '1aaa4422-d200-4fd8-b259-78875e823d06',
    label: 'Nhân viên kỹ thuật',
  },
];

export const TYPES_ACCOUNT_ALL = [
  {
    value: '',
    label: 'Tất cả',
  },
  ...TYPES_ACCOUNT,
];

export const STATE_MAINTENANCE = [
  {
    value: ESTATUS.PENDING,
    label: 'Chờ xử lý',
  },
  {
    value: ESTATUS.INPROGRESS,
    label: 'Đang xử lý',
  },
  {
    value: ESTATUS.COMPLETE,
    label: 'Hoàn thành',
  },
  {
    value: ESTATUS.COMPLETED,
    label: 'Đã hoàn thành',
  },
];

export const STATE_MAINTENANCE_ALL = [
  {
    value: '',
    label: 'Tất cả',
  },
  ...STATE_MAINTENANCE,
];

export const TYPE_PROBLEM = [
  {
    value: 'SC',
    label: 'Sửa  chữa',
  },
  {
    value: 'BD',
    label: 'Bảo dưỡng',
  },
];

export const ROLES = [
  {
    value: '5554872b-ee57-497a-b9fc-d2c3cd08bcb7',
    title: 'PRINCIPAL',
  },
  {
    value: '1aaa4422-d200-4fd8-b259-78875e823d06',
    title: 'STAFF',
  },
  {
    value: 'c1b2a78f-7652-4a63-83a6-e7be987900e6',
    title: 'ADMIN',
  },
];

export const defaultTableParams: TablePaginationConfig = {
  current: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_SIZE_PAGE,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
};

const json_user = localStorage.getItem('auth');
export const authUser = json_user ? JSON.parse(json_user) : undefined;
