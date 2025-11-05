import { axios } from '../../request';

export const doLogin = () => {
  return axios.request({
    url: '/login',
    method: 'post',
  });
}