import { BASE_URL } from '@/constants/urls';
import axios from 'axios';

const client = axios.create({
  baseURL: `${BASE_URL}/`,
  timeout: 10000,
});

client.interceptors.request.use(
  async (config) => {
    if (config.method === 'get') {
      const currentTime = new Date().getTime();
      const oldUrl: any = config.url;
      let newUrl = config.url;
      if (oldUrl.includes('?')) {
        newUrl = `${oldUrl}&time=${currentTime}`;
      } else {
        newUrl = `${oldUrl}?time=${currentTime}`;
      }
      config.url = newUrl;
    }
    const accessToken = localStorage.getItem('accessToken');
    const cloneConfig = { ...config };
    if (accessToken && cloneConfig.headers) {
      cloneConfig.headers.authorization = `Bearer ${accessToken}`;
    }

    return cloneConfig;
  },
  (error) => Promise.reject(error),
);

const responseErrorHandler = async (error: any) => {
  if (error.response.status === 401) {
    setTimeout(() => {
      window.location.href = '/user/login';
    }, 1000);
  }
  return Promise.reject(error.response.data);
};

client.interceptors.response.use(
  (response) => response,
  (error) => responseErrorHandler(error),
);

export default client;
