import axios from 'axios';

const serverAxios = req => axios.create({
  baseURL: 'http://localhost:8758',
  headers: {
    cookie: req.get('cookie') || ''
  },
  params: {
    secret: '28dSfg45e4a'
  }
});

export default serverAxios;