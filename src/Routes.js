import App from './App';
import Home from './container/Home/';
import Login from './container/Login/';
import Translation from './container/Translation/';
import NotFound from './container/NotFound/';

export default [
  {
    path: '/',
    component: App,
    loadData: App.loadData,
    key: 'app',
    routes: [
      {
        path: '/',
        component: Home,
        exact: true,
        loadData: Home.loadData,
        key: 'home',
      },
      {
        path: '/login',
        component: Login,
        exact: true,
        key: 'login'
      },
      {
        path: '/translation',
        component: Translation,
        loadData: Translation.loadData,
        exact: true,
        key: 'translation'
      },
      {
        component: NotFound
      }
    ]
  }
];