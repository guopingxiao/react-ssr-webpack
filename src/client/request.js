import axios from 'axios';

const clientAxios = axios.create({
  baseURL: '',
  params: {
    secret: '28dSfg45e4a'
  }
});

export default clientAxios;