import { AxiosResponse } from '@umijs/max';
import client from '..';

// export const UploadImagesApi = async (file: File | any, fileName: string) => {
//   const url: string = await client.get(`uploads/image/${fileName}`).then((res: AxiosResponse) => res.data);

//   await fetch(url, {
//     headers: {
//       'Content-Type': '',
//     },
//     method: 'POST',
//     body: file,
//   });
//   return url.split('?')[0];
// };

export const UploadImagesApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return client
    .post('uploads/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse) => res.data);
};

export const UploadImagesMultiplieApi = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });
  return client
    .post('uploads/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res: AxiosResponse) => res.data);
};

export const uploadFilesApi = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return client
    .post<string[]>('uploads/upload-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data);
};
