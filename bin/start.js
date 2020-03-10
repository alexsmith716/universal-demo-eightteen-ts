const fs = require('fs');
require('colors');
const path = require('path');
const express = require('express');
const compression = require('compression');
const http = require('http');
const morgan = require('morgan');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const { getUserAgent } = require('../src/utils/device');
const { isBot } = require('../src/utils/device');
const logger = require('../src/utils/logger');
// const device = require('../src/utils/device'); // getUserAgent isBot

/* eslint-disable global-require */

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8080;

logger.log('>>>>>>>>>>>>>>>>> START > __CLIENT__ ?: ', __CLIENT__);
logger.log('>>>>>>>>>>>>>>>>> START > __SERVER__ ?: ', __SERVER__);
logger.log('>>>>>>>>>>>>>>>>> START > __DEVELOPMENT__ ?: ', __DEVELOPMENT__);
logger.log('>>>>>>>>>>>>>>>>> START > __DISABLE_SSR__ ?: ', __DISABLE_SSR__);
logger.log('>>>>>>>>>>>>>>>>> START > __DLLS__ ?: ', __DLLS__);
logger.log('>>>>>>>>>>>>>>>>> START > HOST ?: ', host);
logger.log('>>>>>>>>>>>>>>>>> START > PORT ?: ', port);

const unhandledRejections = new Map();

process.on('unhandledRejection', (reason, promise) => {
  logger.error('>>>> BIN > START > process > Unhandled Rejection at promise:', promise);
  logger.error('>>>> BIN > START > process > Unhandled Rejection reason:', reason);
  unhandledRejections.set(promise, reason);
});

process.on('rejectionHandled', (promise) => {
  logger.error('>>>> BIN > START > process > rejectionHandled > promise:', promise);
  unhandledRejections.delete(promise);
});

const app = express();
const server = http.createServer(app);

app.set('port', port);
app.use(morgan('dev'));
app.use(compression());

app.use((req, res, next) => {
  logger.log('>>>>>>>>>>>>>>>>> START > REQUEST IN <<<<<<<<<<<<<<<<<<<<<<<');
  // logger.log('>>>>>>>>>>>>>>>>> START > REQ.ip +++++++++++++: ', req.ip);
  logger.log('>>>>>>>>>>>>>>>>> START > REQ.method +++++++++++++++: ', req.method);
  logger.log('>>>>>>>>>>>>>>>>> START > REQ.url ++++++++++++++++++: ', req.url);
  logger.log('>>>>>>>>>>>>>>>>> START > REQ.path ++++++++++++++++++: ', req.path);
  // logger.log('>>>>>>>>>>>>>>>>> START > REQ.headers ++++++++++++++: ', req.headers);
  // logger.log('>>>>>>>>>>>>>>>>> START > REQ.cookies ++++++++++++++: ', req.cookies);
  // logger.log('>>>>>>>>>>>>>>>>> START > REQ.session ++++++++: ', req.session);
  // logger.log('>>>>>>>>>>>>>>>>> START > REQ.params +++++++++: ', req.params);
  logger.log('>>>>>>>>>>>>>>>>> START > REQ.originalUrl ++++: ', req.originalUrl);
  logger.log('>>>>>>>>>>>>>>>>> START > REQUEST OUT <<<<<<<<<<<<<<<<<<<<<<<');
  next();
});

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use((req, res, next) => {
  req.userAgent = getUserAgent(req.headers['user-agent']);
  req.isBot = isBot(req.headers['user-agent']);
  next();
});

// ---------------------------------------------------------------------

let isBuilt = false;

const done = () => {
  if (!isBuilt) {
    server.listen(port, host, (err) => {
      isBuilt = true;
      logger.end('>>>> BIN > START > STATS COMPILER HAS COMPLETED BUILD !! WAIT IS OVER !');
      if (err) {
        logger.error('>>>> BIN > START > ERROR:', err);
      }
    });
  }
};

logger.start(`>>>> BIN > START > __DEVELOPMENT__ ?: ${__DEVELOPMENT__}`);
logger.start('>>>> BIN > START > STATS COMPILER ATTEMPTING BUILD ! PLEASE WAIT ! ...');

if (__DEVELOPMENT__) {
  const clientConfigDev = require('../webpack/dev.client');
  const serverConfigDev = require('../webpack/dev.server');
  const { publicPath } = clientConfigDev.output;

  const serverOptions = { publicPath };

  app.use('/dlls/:dllName.js', (req, res, next) => {
    const dllPath = path.join(__dirname, '..', 'build', 'dlls', `${req.params.dllName}.js`);
    fs.access(dllPath, fs.constants.R_OK, (err) => (err ? res.send(`NO DLL: (${req.originalUrl})')`) : next()));
  });

  const compiler = webpack([clientConfigDev, serverConfigDev]);
  const clientCompiler = compiler.compilers[0];
  const devMiddleware = webpackDevMiddleware(compiler, serverOptions);
  app.use(devMiddleware);

  app.use((req, res, next) => {
    next();
  });

  app.use(webpackHotMiddleware(clientCompiler));

  app.use(webpackHotServerMiddleware(compiler, { chunkName: 'server' }));

  devMiddleware.waitUntilValid(done);
} else {
  const clientConfigProd = require('../webpack/prod.client');
  const serverConfigProd = require('../webpack/prod.server');

  webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
    if (err) {
      logger.error('>>>> BIN > START > PROD > err: ', err.stack || err);
      if (err.details) {
        logger.error('>>>> BIN > START > PROD > err.details: ', err.details);
      }
      return;
    }

    const clientStats = stats.toJson().children[0];
    const serverStats = stats.toJson().children[1];

    if (stats.hasErrors()) {
      logger.error('>>>> BIN > START > clientStats.hasErrors: ', clientStats.errors);
      logger.error('>>>> BIN > START > serverStats.hasErrors: ', serverStats.errors);
    }
    if (stats.hasWarnings()) {
      logger.warn('>>>> BIN > START > clientStats.warnings: ', clientStats.warnings);
      logger.warn('>>>> BIN > START > clientStats.warnings: ', serverStats.warnings);
    }

    // eslint-disable-next-line import/no-unresolved
    const serverRender = require('../build/server/server.js').default;

    app.use(serverRender({ clientStats }));

    done();
  });
}

const gracefulShutdown = (msg, cb) => {
  logger.log(`>>>> BIN > START > Mongoose Connection closed through: ${msg}`);
  cb();
};

process.on('exit', code => {
  logger.log(`>>>> BIN > START > About to exit with code: ${code}`);
});

process.on('warning', warning => {
  logger.warn('>>>> BIN > START > Node process warning.name:', warning.name);
  logger.warn('>>>> BIN > START > Node process warning.message:', warning.message);
  logger.warn('>>>> BIN > START > Node process warning.stack:', warning.stack);
});

process.on('SIGINT', m => {
  logger.log('>>>> BIN > START > CHILD got Node process SIGINT message:', m);
  gracefulShutdown('app termination', () => {
    logger.log('>>>> BIN > START > Mongoose SIGINT gracefulShutdown');
    process.exit(0);
  });
});

process.once('SIGUSR2', m => {
  logger.log('>>>> BIN > START > CHILD got Node process SIGUSR2 message:', m);
  gracefulShutdown('nodemon restart', () => {
    logger.log('>>>> BIN > START > Mongoose SIGUSR2 gracefulShutdown');
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGTERM', m => {
  logger.log('>>>> BIN > START > CHILD got Node process SIGTERM message:', m);
  gracefulShutdown('Heroku app termination', () => {
    logger.log('>>>> BIN > START > Mongoose SIGTERM gracefulShutdown');
    process.exit(0);
  });
});
