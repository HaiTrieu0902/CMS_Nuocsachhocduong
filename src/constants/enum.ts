export enum ESidebarPath {
  DASHBOARD = '/dashboard',
  MAINTENANCE = '/maintenance',
  PRODUCT = '/products',
  CATEGORY = '/category',
  NEW = '/news',
  NOTIFICATION = '/notification',
  ACCOUNT = '/account',
  SCHOOL = '/school',
  CONTRACT = '/contract',
}

export enum ETYPE_ACCOUNT {
  ADMIN = 'Admin',
  PRINCIPAL = 'Principal',
  STAFF = 'Staff',
}

export enum EMaintenanceStatus {
  PENDING = 'Pending',
  INPROGRESS = 'In Progress',
  COMPLETE = 'Complete',
  COMPLETED = 'Completed',
}

export enum EMaintenanceConvert {
  PENDING = 'Chờ xử lý',
  INPROGRESS = 'Đang xử lý',
  COMPLETE = 'Hoàn thành',
  COMPLETED = 'Đã hoàn thành',
}
