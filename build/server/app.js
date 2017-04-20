'use strict';

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _server2.default.create(_config2.default);