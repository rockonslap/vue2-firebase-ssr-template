const fs = require('fs');
const path = require('path');
const express = require('express');
// const favicon = require('serve-favicon');
const compression = require('compression');

const resolve = file => path.resolve(__dirname, file);
const { createBundleRenderer } = require('vue-server-renderer');

const isProd = process.env.NODE_ENV === 'production';
const app = express();
const template = fs.readFileSync(resolve('./views/index.html'), 'utf-8');

function createRenderer(bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    template,
    basedir: resolve('./dist'),
    runInNewContext: true,
  }));
}

let renderer;
let readyPromise;
if (isProd) {
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');
  renderer = createRenderer(bundle, {
    clientManifest,
  });
} else {
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  });
}

const serve = (pathFile, cache) => express.static(resolve(pathFile), {
  // maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
  maxAge: cache && isProd ? 0 : 0,
});

app.use(compression({ threshold: 10240 }));
// app.use(favicon('./static/assets/favicon.ico'));
app.use('/dist', serve('./dist', true));
app.use('/assets', serve('./static/assets', true));
app.use('/manifest.json', serve('./manifest.json', true));
function render(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip, req.originalUrl, 'server render');

  const context = {
    title: 'Vue Firebase SSR Template',
    image: '',
    description: '',
    url: req.url,
  };
  
  res.setHeader('Content-Type', 'text/html');

  const handleError = (err) => {
    if (err && err.code === 404) {
      res.status(404).end('404 | Page Not Found');
    } else {
      res.status(500).end('500 | Internal Server Error');
      console.error(`error during render : ${req.url}`);
      console.error(err.stack);
    }
  };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err);
    }
    res.end(html);
  });
}

const cacheMiddleware = seconds => (req, res, next) => {
  if (req.url !== '/clear-cache') {
    res.setHeader('Cache-Control', `public, max-age=${seconds}`);
  }
  next();
};

if (isProd) {
  // const seconds = 60 * 60 * 24 * 30;
  const seconds = 0;
  app.get('/:lang?', cacheMiddleware(seconds), render);
  app.get('/:lang?/*', cacheMiddleware(seconds), render);
} else {
  app.get('/:lang?', (req, res) => {
    readyPromise.then(() => render(req, res));
  });
  app.get('/:lang?/*', (req, res) => {
    readyPromise.then(() => render(req, res));
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});
