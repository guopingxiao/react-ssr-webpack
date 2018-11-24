import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';

export const render = (store, routes, req, context) => {
  // 让matchRoutes里边所有的组件，对应的loadData方法执行一次
  const content = renderToString(
    (
      <Provider store={store}>
        <StaticRouter location={req.path} context={context}>
          <div>
            {renderRoutes(routes)}
          </div>
        </StaticRouter>
      </Provider>
    )
  );
  
  const cssStr = context.css.length ? context.css.join('\n') : '';

  const helmet = Helmet.renderStatic();

  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      <style>${cssStr}</style>
    </head>
    <body>
      <div id="root">${content}</div>
      <script >
        // 客户端的数据注水
        window.context = {
          state: ${JSON.stringify(store.getState())}
        }
      </script>
      <script src="/index.js"></script>
    </body>
  </html>
`;
  return html;
};