import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 5000, // 请求超时时间
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true //跨域请求，允许保存cookie
});

export default request;
export {
  request as axios
}