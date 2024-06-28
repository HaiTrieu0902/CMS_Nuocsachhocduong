export enum ESidebarPath {
  DASHBOARD = '/dashboard',
  MAINTENANCE = '/maintenance',
  PRODUCT = '/products',
  CATEGORY = '/category',
  NEW = '/news',
  NOTIFICATION = '/notification',
  ACCOUNT = '/account',
  SCHOOL = '/school',
  INSTALL = '/install',
}

export enum ETYPE_ACCOUNT {
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  STAFF = 'STAFF',
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

export enum EROLE_CONVERT {
  ADMIN = 'c1b2a78f-7652-4a63-83a6-e7be987900e6',
  PRINCIPAL = '5554872b-ee57-497a-b9fc-d2c3cd08bcb7',
  STAFF = '1aaa4422-d200-4fd8-b259-78875e823d06',
}

export enum ESTATUS {
  PENDING = 'e512b0b1-5960-48b1-8266-0d5e6cb9d2d4',
  INPROGRESS = '48763c34-6c31-4243-a7a3-eb6c21ae8574',
  COMPLETE = '9d995935-0d8d-46f7-838e-49255208e874',
  COMPLETED = 'd19b7fcc-7bb4-4d25-9e11-804fa882f310',
  PEDING_INSTALL = '9dca126d-1c83-45bc-a00c-6139bd8a8f6e',
  INPROGRESS_INSTALL = 'ea340138-fb2e-42d3-a312-6ce97a6d766a',
  DELETED = '6b06e733-c205-4c89-b5b3-c3bb9131575a',
}

export enum EMAINTENANCE {
  BD = '8b746035-46bf-428f-b4db-b84e9b375b5f',
  SC = 'd1e6d70f-bd4a-4acb-99bc-8801dab712cf',
}
