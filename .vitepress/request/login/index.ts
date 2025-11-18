import { axios, AxiosResponse } from '../../request';
import { publicPemKey } from './constants';

interface LoginParams {
  username: string;
  password: string;
}

export const publicPemApi = (): AxiosResponse<string>  => {
  return axios.request({
    url: '/getPublicPem',
    method: 'get'
  });
}
export const getPublicPem = async () => {
  const pemContent = sessionStorage.getItem(publicPemKey);
  if (pemContent) {
    return pemContent;
  } else {
    const { data: publicPem } = await publicPemApi();
    sessionStorage.setItem(publicPemKey, publicPem);
    return publicPem;
  }
}

export const loginApi = (data: LoginParams): AxiosResponse<any> => {
  return axios.request({
    url: '/login',
    method: 'post',
    data
  });
}