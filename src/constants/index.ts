import { TablePaginationConfig } from 'antd';
import { EMaintenanceStatus } from './enum';

export const DEFAULT_SIZE_PAGE = 10;
export const DEFAULT_SIZE_PAGE_MAX = 1000;

export const DEFAULT_PAGE_NUMBER = 1;

export const TYPES_ACCOUNT = [
  {
    value: 'Admin',
    label: 'Quản trị viên',
  },
  {
    value: 'Principal',
    label: 'Hiệu trưởng',
  },
  {
    value: 'Staff',
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
    value: EMaintenanceStatus.PENDING,
    label: 'Chờ xử lý',
  },
  {
    value: EMaintenanceStatus.INPROGRESS,
    label: 'Đang xử lý',
  },
  {
    value: EMaintenanceStatus.COMPLETE,
    label: 'Hoàn thành',
  },
  {
    value: EMaintenanceStatus.COMPLETED,
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

export const defaultTableParams: TablePaginationConfig = {
  current: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_SIZE_PAGE,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '30', '40', '50'],
};
