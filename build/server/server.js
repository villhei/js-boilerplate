'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var create = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(config) {
    var app, port, server;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app = (0, _express2.default)();

            app.use(_bodyParser2.default.json());

            app.use(_expressWinston2.default.logger({
              transports: [new _winston2.default.transports.Console({
                level: config.logLevel,
                json: false,
                colorize: true
              }), new _winston2.default.transports.File({
                filename: config.logFile,
                level: config.logLevel
              })],
              expressFormat: true,
              colorize: true,
              meta: false,
              msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}'
            }));

            app.use(_express2.default.static(PUBLIC_ASSETS));

            port = 3000;
            server = app.listen(port);

            _winston2.default.info('* Server listening in port ' + port);
            return _context.abrupt('return', server);

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function create(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

require('./config/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var SERVER_NOT_RUNNING = '*** Server not running';
var SERVER_SHUTTING_DOWN = '*** Server shutting down';

var PUBLIC_ASSETS = _path2.default.join(__dirname, '../client/public');

function destroy(server) {
  if (!server) {
    throw new Error(SERVER_NOT_RUNNING);
  }

  _winston2.default.info(SERVER_SHUTTING_DOWN);

  return server.close();
}

exports.default = {
  create: create,
  destroy: destroy
};