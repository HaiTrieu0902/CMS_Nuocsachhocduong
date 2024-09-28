/* eslint-disable @typescript-eslint/no-unused-vars */
import { EMAINTENANCE, EMaintenanceConvert, EMaintenanceStatus, ESTATUS, ETYPE_ACCOUNT } from '@/constants/enum';
import { BASE_URL } from '@/constants/urls';
import { IInstallRecord } from '@/models/install.model';
import { UploadImagesMultiplieApi } from '@/services/api/common';
import { Editor } from '@ckeditor/ckeditor5-core';
import { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload';
import { RcFile } from 'antd/es/upload';
import { UploadFile } from 'antd/lib';
import { addMonths, format } from 'date-fns';
import dayjs from 'dayjs';
/**  emailValidationPattern */
export const emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**  getBase64 */
export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

/**  resizeImage */
export const resizeImage = (base64Str: string, maxWidth = 200, maxHeight = 200) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = maxWidth;
      const MAX_HEIGHT = maxHeight;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL());
    };
  });
};

/**  allowedFormatsImage */
export const allowedFormatsImage = ['image/png', 'image/jpeg', 'image/jpg'];
export const allowedFormatsDocument = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/pdf',
  'text/plain',
];
/**  sortColumnText */
export const sortColumnText = (a: string, b: string) => {
  return a.toLowerCase() > b.toLowerCase() ? 1 : b.toLowerCase() > a.toLowerCase() ? -1 : 0;
};

/**  sortColumnDate */
export const sortColumnDate = (a: any, b: any) => {
  return dayjs(a).isAfter(dayjs(b)) ? 1 : dayjs(b).isAfter(dayjs(a)) ? -1 : 0;
};

/**  replaceDot */
export const replaceDot = (value: any) => {
  return String(value).replace(/\./g, '');
};

/**  formatDecimalValue */
export const formatDecimalValue = (value: number) => {
  return Number(value.toString().replace(/[, $]/g, ''));
};

/**  checkKeyCode */
export const checkKeyCode = (e: KeyboardEvent) => {
  const isNumberKey = e.key >= '0' && e.key <= '9';
  const isBackspace = e.key === 'Backspace';

  if (!(isNumberKey || isBackspace)) {
    e.preventDefault();
  }
};

const removeLeadingZeros = (value: string) => {
  return value.replace(/^0+/, '') || '0';
};

export const checkKeyCodeDiscount = (e: KeyboardEvent) => {
  const isNumberKey = e.key >= '0' && e.key <= '9';
  const isBackspace = e.key === 'Backspace';
  const isDot = e.key === '.';
  const input = e.target as HTMLInputElement;
  const currentValue = input.value;
  if (isDot && currentValue.includes('.')) {
    e.preventDefault();
    return;
  }
  if (!(isNumberKey || isBackspace || isDot)) {
    e.preventDefault();
    return;
  }
  const newValue = isBackspace ? currentValue.slice(0, -1) : currentValue + e.key;
  const cleanedValue = removeLeadingZeros(newValue);
  const newValueNumber = parseFloat(cleanedValue);
  if (!isBackspace && (isNaN(newValueNumber) || newValueNumber < 0 || newValueNumber > 100)) {
    e.preventDefault();
    return;
  }
  if (newValue !== cleanedValue) {
    setTimeout(() => {
      input.value = cleanedValue;
    }, 0);
  }
};

/**  PreView All File Upload */
export const onPreviewAllFile = async (file: UploadFile) => {
  let src = file.url as string;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as RcFile);
      reader.onload = () => resolve(reader.result as string);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

/* handle beforeSave load image */
export const handleBeforeSaveLoadImage = async (editorContent: string) => {
  const uploadedFiles: File[] = [];
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(editorContent, 'text/html');
  const imgElements = htmlDoc.getElementsByTagName('img');

  for (let i = 0; i < imgElements.length; i++) {
    const imgSrc = imgElements[i].getAttribute('src');
    if (imgSrc && imgSrc.startsWith('data:')) {
      const dataUrlParts = imgSrc.split(',');
      const mimeString = dataUrlParts[0].split(':')[1].split(';')[0];
      const byteString = atob(dataUrlParts[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);
      for (let j = 0; j < byteString.length; j++) {
        intArray[j] = byteString.charCodeAt(j);
      }
      const blob = new Blob([arrayBuffer], { type: mimeString });
      const file = new File([blob], `image_${i}.png`, {
        lastModified: new Date().getTime(),
        type: mimeString,
      });
      uploadedFiles.push(file);
    }
  }

  return uploadedFiles;
};

/* handle update editor content */
export const updateEditorContent = async (uploadedImages: any, editorContent: string, reload?: boolean) => {
  let updatedContent = editorContent;
  const parser = new DOMParser();
  const doc = parser.parseFromString(updatedContent, 'text/html');
  const images = doc.querySelectorAll('img');
  let uploadedIndex = 0;
  for (let index = 0; index < images.length; index++) {
    const img = images[index];
    const imgSrc = img.getAttribute('src');
    if (imgSrc && imgSrc.startsWith('data:')) {
      if (uploadedIndex < uploadedImages.length) {
        img.setAttribute('src', uploadedImages[uploadedIndex]);
        img.setAttribute('style', 'width: 100% !important; object-fit: contain');
        img.setAttribute('width', 'auto');
        img.setAttribute('height', 'auto');
        uploadedIndex++;
      } else {
        img.setAttribute('src', `${imgSrc}`);
        img.setAttribute('style', 'width: 100% !important; object-fit: contain');
        img.setAttribute('width', 'auto');

        img.setAttribute('height', 'auto');
      }
    }
  }
  updatedContent = doc.documentElement.innerHTML;
  return updatedContent;
};

/* handle upload file in Ckeditor */
export const uploadAdapter = (loader: FileLoader): UploadAdapter => {
  return {
    upload: () => {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const file = await loader.file;
          if (file) {
            if (!allowedFormatsImage.includes(file.type)) {
              reject('Bạn chỉ upload PNG, JPEG, or JPG file!');
              return;
            }
            if (file?.size / 1024 / 1024 > 5) {
              reject('File không thể lớn hơn 5mb!');
              return;
            }
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            const imageUrl = event.target?.result as string;
            resolve({ default: imageUrl });
          };
          reader.readAsDataURL(file as never);
        } catch (error) {
          reject('Reject');
        }
      });
    },
    abort: () => {},
  };
};

/* handle upload plugin */
export const uploadPlugin = (editor: Editor) => {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return uploadAdapter(loader);
  };
};

/* handle ImageProcessing*/
export const handleImageProcessing = async (fileList: any[]): Promise<string[]> => {
  const listImagesOlder = fileList
    ?.filter((item: any) => item?.status === 'hasExits')
    ?.map((item) => item?.url.replace(`${BASE_URL}/`, ''));

  /**  check listitem newer */
  const listImagesNewer = await fileList
    ?.filter((item: any) => item?.status !== 'hasExits')
    ?.map((element: any) => element?.originFileObj || element);

  const uploadResults = listImagesNewer?.length > 0 ? await UploadImagesMultiplieApi(listImagesNewer) : [];
  const imageUrls =
    listImagesNewer?.length > 0 ? uploadResults?.data?.map((item: any) => `common/images/${item?.filename}`) : [];

  return [...listImagesOlder, ...imageUrls];
};

/* handle update content ckeditor*/
export const updateImageUrls = (content: string) => {
  return content.replace(/<img [^>]*src="([^"]+)"[^>]*>/g, (match, p1) => {
    const newUrl = `${BASE_URL}/${p1}`;
    return match.replace(p1, newUrl);
  });
};

/* handle update content ckeditor*/
export const removeImageUrls = (content: string) => {
  const regex = new RegExp(`${BASE_URL}/`, 'g');
  return content.replace(regex, '');
};

/* handle getStatusText*/
export const getStatusText = (status: EMaintenanceStatus): string => {
  switch (status) {
    case EMaintenanceStatus.PENDING:
      return EMaintenanceConvert.PENDING;
    case EMaintenanceStatus.INPROGRESS:
      return EMaintenanceConvert.INPROGRESS;
    case EMaintenanceStatus.COMPLETE:
      return EMaintenanceConvert.COMPLETE;
    case EMaintenanceStatus.COMPLETED:
      return EMaintenanceConvert.COMPLETED;
    default:
      return EMaintenanceStatus.PENDING;
  }
};

export const getRoleDescription = (role: string) => {
  console.log('role', role);
  switch (role) {
    case ETYPE_ACCOUNT?.ADMIN:
      return 'Quản trị viên';
    case ETYPE_ACCOUNT?.STAFF:
      return 'Nhân viên kỹ thuật';
    case ETYPE_ACCOUNT?.PRINCIPAL:
      return 'Quản lý thiết bị lọc nước nhà trường';
    default:
      return 'Quản trị viên';
  }
};

interface RouteDescription {
  pattern: RegExp;
  description: string;
}

const headerDescriptions: RouteDescription[] = [
  { pattern: /^\/dashboard$/, description: 'TRANG CHỦ' },
  { pattern: /^\/products$/, description: 'SẢN PHẨM' },
  { pattern: /^\/products\/create$/, description: 'SẢN PHẨM' },
  { pattern: /^\/products\/[^/]+$/, description: 'SẢN PHẨM' }, // id

  { pattern: /^\/category$/, description: 'LOẠI SẢN PHẨM' },

  { pattern: /^\/news$/, description: 'TIN TỨC' },
  { pattern: /^\/news\/create$/, description: 'TIN TỨC' },
  { pattern: /^\/news\/[^/]+$/, description: 'TIN TỨC' }, // id

  { pattern: /^\/notification$/, description: 'THÔNG BÁO' },
  { pattern: /^\/notification\/create$/, description: 'THÔNG BÁO' },
  { pattern: /^\/notification\/[^/]+$/, description: 'THÔNG BÁO' }, // id

  { pattern: /^\/account$/, description: 'TÀI KHOẢN' },

  { pattern: /^\/school$/, description: 'TRƯỜNG HỌC' },
  { pattern: /^\/school\/revenue$/, description: 'TRƯỜNG HỌC' },
  { pattern: /^\/school\/revenue\/[^/]+$/, description: 'TRƯỜNG HỌC' }, // id
  { pattern: /^\/school\/invest$/, description: 'TRƯỜNG HỌC' },
  { pattern: /^\/school\/agreements\/[^/]+$/, description: 'TRƯỜNG HỌC' }, // id

  { pattern: /^\/install$/, description: 'HỒ SƠ LẮP ĐẶT' },

  { pattern: /^\/device-install$/, description: 'THIẾT BỊ ĐÃ LẮT ĐẶT' },
];

export const getTextHeaderDescription = (pathname: string): string => {
  const match = headerDescriptions.find((route) => route.pattern.test(pathname));
  return match ? match.description : '';
};

export const handleGetCategoryMaintenance = (data: IInstallRecord[], idSelected: string): string => {
  const currentRecord = data.find((item) => item.id === idSelected);
  if (!currentRecord || !currentRecord.timeInstall || !currentRecord.warrantyPeriod) {
    return 'Chưa xác định';
  }

  const timeInstall = new Date(currentRecord.timeInstall);
  const warrantyEndDate = new Date(timeInstall);
  warrantyEndDate.setMonth(timeInstall.getMonth() + currentRecord.warrantyPeriod);

  const currentDate = new Date();

  if (currentDate <= warrantyEndDate) {
    return 'Bảo hành';
  } else {
    return 'Sửa chữa';
  }
};

export const handleGetCategoryMaintenanceId = (data: IInstallRecord[], idSelected: string): string => {
  const currentRecord = data.find((item) => item.id === idSelected);
  if (!currentRecord || !currentRecord.timeInstall || !currentRecord.warrantyPeriod) {
    return 'Không xác định';
  }

  const timeInstall = new Date(currentRecord.timeInstall);
  const warrantyEndDate = new Date(timeInstall);
  warrantyEndDate.setMonth(timeInstall.getMonth() + currentRecord.warrantyPeriod);

  const currentDate = new Date();

  if (currentDate <= warrantyEndDate) {
    return EMAINTENANCE?.BD;
  } else {
    return EMAINTENANCE?.SC;
  }
};

export const convertDate = (date: any) => {
  const options: any = { hour: '2-digit', minute: '2-digit', hour12: true };
  const res = date.toLocaleTimeString('en-US', options);
  return res || 'N/A';
};

export const renderContentClearSpecialCharacter = (content: any) => {
  const regex = /{{(.*?)}}/g;
  const text = content.replace(regex, (match: any, group: any) => {
    return group;
  });
  return text;
};

export const calculateWarrantyExpiryDate = (timeInstall: any, warrantyPeriod: any) => {
  const installDate = new Date(timeInstall);
  const expiryDate = addMonths(installDate, warrantyPeriod);
  return format(expiryDate, 'dd/MM/yyyy HH:mm:ss');
};

export const revertStatusDevice = (row: IInstallRecord) => {
  const isCompleted = (statusId: any) => statusId === ESTATUS.COMPLETE || statusId === ESTATUS.COMPLETED;
  if (isCompleted(row?.status?.id)) {
    if (row?.maintenances && row?.maintenances.length > 0) {
      const maintenance = row.maintenances[0];
      const maintenanceStatus = isCompleted(maintenance.statusId);
      if (maintenance.categoryMaintenanceId === EMAINTENANCE.BD) {
        return maintenanceStatus ? 'Bình thường' : 'Đang bảo dưỡng';
      } else {
        return maintenanceStatus ? 'Bình thường' : 'Đang sửa chữa';
      }
    } else {
      return 'Bình thường';
    }
  } else {
    return 'Đang lắp đặt';
  }
};

export const revertNoteDevice = (row: IInstallRecord) => {
  const isCompleted = (statusId: any) => statusId === ESTATUS.COMPLETE || statusId === ESTATUS.COMPLETED;
  if (isCompleted(row?.status?.id)) {
    if (row?.maintenances && row?.maintenances.length > 0) {
      const maintenance = row.maintenances[0];
      const maintenanceStatus = isCompleted(maintenance.statusId);
      if (maintenance.categoryMaintenanceId === EMAINTENANCE.BD) {
        return maintenanceStatus ? '' : `${maintenance?.title} / ${maintenance?.reason}`;
      } else {
        return maintenanceStatus ? '' : `${maintenance?.title} / ${maintenance?.reason}`;
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
};
