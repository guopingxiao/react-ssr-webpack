import express from 'express';
import chalk from 'chalk';
import proxy from 'express-http-proxy';
import { matchRoutes } from 'react-router-config';
import { render } from './utils';
import { getServerStore } from '../store/';
import routes from '../Routes';

const app = express();
const PORT = 8888;

app.use(express.static('public'));

app.use('/api', proxy('http://localhost:8758', {
  proxyReqPathResolver: function (req) {
    return `/api${req.url}`;
  }
}));

app.get('*', (req, res) => {
  const store = getServerStore(req);
  
  const matchedRoutes = matchRoutes(routes, req.path);
  const promises = [];

  matchedRoutes.forEach(item => {
    const loadData = item.route.loadData;
    if (loadData) {
      const promise = new Promise((resolve) => {
        loadData(store).then(resolve).catch(resolve);
      });
      promises.push(promise);
    }
  });

  Promise.all(promises).then(() => {
    const context = {css: []};
    const html = render(store, routes, req, context);
    if (context.action && context.action === 'REPLACE') {
      res.redirect(301, context.url);
    } else if (context.NotFound) {
      res.status(404);
      res.send(html);
    } else {
      res.send(html);
    }
  });
  
  // res.send(render(store, routes, req));
});

app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(chalk['bgYellow'](`the server is running at localhost:${PORT}`));
  }
});
