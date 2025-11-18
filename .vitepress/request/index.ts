import axios from 'axios';
import { useRouter } from 'vitepress';
import { TkMessage, usePagePath } from 'vitepress-theme-teek';
import { pulseTokenKey } from './login/constants';

interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  error?: string;
}
type AxiosResponse<T> = Promise<ApiResponse<T>>;

const getToken = () => {
  const infoStr = sessionStorage.getItem(pulseTokenKey);
  const info = infoStr ? JSON.parse(infoStr) : {};
  return info.token;
}
const redirectLoginPage = () => {
  const router = useRouter();
  const { loginPath } = usePagePath();
  router.go(loginPath.value);
}

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000, // 请求超时时间
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true //跨域请求，允许保存cookie
});

axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error)
});

// @ts-ignore
request.interceptors.response.use(res => {
  const apiResponse = res.data as ApiResponse<any>;
  const status = apiResponse.code || res.status;
  const message = apiResponse.message;

  if (status === 401) {
    sessionStorage.removeItem(pulseTokenKey);
    redirectLoginPage();
  }

  if (status !== 200) {
    TkMessage.error(message);
    return Promise.reject(new Error(message));
  }

  return apiResponse;
}, error => {
  TkMessage.error('系统异常');
  return Promise.reject(new Error(`系统异常: ${error}`));
});

export default request;
export {
  request as axios,
  ApiResponse,
  AxiosResponse,
}