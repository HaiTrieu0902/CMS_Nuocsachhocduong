import { RcFile } from 'antd/es/upload';
import dayjs from 'dayjs';
// import { NumberFormatValues } from 'react-number-format';

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

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

export const allowedFormatsImage = ['image/png', 'image/jpeg', 'image/jpg'];

export const validateSizeImage = (fileSize: number, maxSize = 1): boolean => {
  const formattedFileSize = fileSize / 1024 / 1024;

  const isValidFileSize = formattedFileSize <= maxSize;
  return isValidFileSize;
};

export const sortColumnText = (a: string, b: string) => {
  return a.toLowerCase() > b.toLowerCase() ? 1 : b.toLowerCase() > a.toLowerCase() ? -1 : 0;
};

export const sortColumnDate = (a: any, b: any) => {
  return dayjs(a).isAfter(dayjs(b)) ? 1 : dayjs(b).isAfter(dayjs(a)) ? -1 : 0;
};

export const replaceDot = (value: any) => {
  return String(value).replace(/\./g, '');
};

export const handleFormatterDecimal = (value: any) => {
  if (value === null) {
    return ''; // Display nothing when the input is empty
  }

  const floatValue = parseFloat(value);
  if (isNaN(floatValue)) {
    return ''; // Display nothing if it's not a valid number
  }

  const MAX_VALUE_DEFAULT = 999999999;
  const reg = /\B(?=(\d{3})+(?!\d))/g;

  if (parseInt(value) === MAX_VALUE_DEFAULT) return MAX_VALUE_DEFAULT.toString().replace(reg, ',') + '.00';

  if (floatValue > MAX_VALUE_DEFAULT) {
    let divisor = (floatValue.toString().length - MAX_VALUE_DEFAULT.toString().length) * 10;
    return (floatValue / divisor).toString().replace(reg, ',');
  }

  // Check if it's an integer or has up to 2 decimal places
  if (Number.isInteger(floatValue) || value.toString().split('.')[1]?.length <= 2) {
    return value.toString().replace(reg, ',');
  } else {
    return (Math.floor(floatValue * 100) / 100).toString().replace(reg, ',');
  }
};

export const formatDecimalValue = (value: number) => {
  return Number(value.toString().replace(/[, $]/g, ''));
};

// export const rangeOfLimit = (values: NumberFormatValues) => {
//   const { formattedValue, value, floatValue } = values as any;
//   if (value.charAt(0) === '0') {
//     if (value.charAt(1) && value.charAt(1) === '0') {
//       return false;
//     }
//   }
//   return formattedValue === '' || (floatValue <= 999999999.99 && floatValue >= 0);
// };

export const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const roundUpToDecimalPlaces = (number: number, decimalPlaces = 2) => {
  const multiplier = Math.pow(10, decimalPlaces);
  const roundedNumber = Math.ceil(number * multiplier) / multiplier;
  return roundedNumber.toFixed(decimalPlaces);
};

// export const rangeOfLimitPercent = (values: NumberFormatValues) => {
//   const { formattedValue, value, floatValue } = values as any;
//   if (value.charAt(0) === '0') {
//     if (value.charAt(1) && value.charAt(1) === '0') {
//       return false;
//     }
//   }
//   return formattedValue === '' || (floatValue <= 99.9 && floatValue >= 0);
// };

// export const rangeOfLimitAmount = (values: NumberFormatValues) => {
//   const { formattedValue, value, floatValue } = values as any;
//   if (value.charAt(0) === '0') {
//     if (value.charAt(1) && value.charAt(1) === '0') {
//       return false;
//     }
//   }
//   return formattedValue === '' || (floatValue <= 9999.9 && floatValue >= 0);
// };

export const getFileSize = async (fileUrl: string) => {
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const res = await fetch(fileUrl, { method: 'GET' });
  const contentLength = res.headers.get('content-length');
  if (contentLength) {
    return formatBytes(Number(contentLength));
  }
  return formatBytes(0);
};

// export const getServiceTypeName = (name: string) => {
//   const service = SERVICE_TYPE_NAMES.find((option) => option.title === name);
//   return service?.name;
// };

export const numberWithCommas = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const optionStatus = [
  {
    label: 'All Status',
    value: '',
  },
  {
    label: 'Active',
    value: 'ACTIVE',
  },
  {
    label: 'Inactive',
    value: 'INACTIVE',
  },
];

export const cartAlertOptions = [
  {
    label: 'All Card Alert',
    value: 'all',
  },
  {
    label: 'No Card Alert',
    value: 0,
  },
  {
    label: 'Red Alert',
    value: 3,
  },
  {
    label: 'Yellow Alert',
    value: 2,
  },
  {
    label: 'Green Alert',
    value: 1,
  },
];

export const paymentMethodOptions = [
  {
    label: 'All Payments',
    value: '',
  },
  {
    label: 'App payment',
    value: 'App payment',
  },
  {
    label: 'Credit card',
    value: 'Credit card',
  },
];

export const checkKeyCode = (e: any) => {
  if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 8)) {
    e.preventDefault();
  }
};

export const emailValidationPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
