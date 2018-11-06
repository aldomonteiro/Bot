'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bot = exports.wait = exports.QuickReplies = exports.Buttons = exports.Elements = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _bluebird = require('bluebird');

var wait = exports.wait = function () {
  var _ref = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee(time) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (resolve) {
              return setTimeout(function () {
                return resolve();
              }, time);
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function wait(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _Elements = require('./Elements.js');

var _Elements2 = _interopRequireDefault(_Elements);

var _Buttons = require('./Buttons.js');

var _Buttons2 = _interopRequireDefault(_Buttons);

var _QuickReplies = require('./QuickReplies.js');

var _QuickReplies2 = _interopRequireDefault(_QuickReplies);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _fetch = require('./libs/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Elements = _Elements2.default;
exports.Buttons = _Buttons2.default;
exports.QuickReplies = _QuickReplies2.default;


var userCache = {};

var Bot = function (_EventEmitter) {
  (0, _inherits3.default)(Bot, _EventEmitter);

  function Bot(verification, debug) {
    (0, _classCallCheck3.default)(this, Bot);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Bot.__proto__ || (0, _getPrototypeOf2.default)(Bot)).call(this));

    _this._debug = debug;
    _this._verification = verification;
    return _this;
  }

  (0, _createClass3.default)(Bot, [{
    key: 'deleteFields',
    value: function () {
      var _ref2 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_fields) {
        var response;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _axios2.default.delete('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + this._token, {
                  headers: { 'Content-Type': 'application/json' },
                  params: {
                    fields: _fields
                  }
                });

              case 3:
                response = _context2.sent;
                return _context2.abrupt('return', response.result);

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2['catch'](0);

                if (!(_context2.t0.response && _context2.t0.response.data && _context2.t0.response.data.error)) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt('return', _context2.t0.response.data.error.message);

              case 13:
                if (!(_context2.t0.response.status && _context2.t0.response.statusText)) {
                  _context2.next = 17;
                  break;
                }

                return _context2.abrupt('return', _context2.t0.response.status + ' - ' + _context2.t0.response.statusText);

              case 17:
                return _context2.abrupt('return', "unknown error");

              case 18:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function deleteFields(_x2) {
        return _ref2.apply(this, arguments);
      }

      return deleteFields;
    }()
  }, {
    key: 'getFields',
    value: function () {
      var _ref3 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(_fields) {
        var response;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _axios2.default.get('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + this._token, {
                  headers: { 'Content-Type': 'application/json' },
                  params: {
                    fields: (0, _stringify2.default)(_fields)
                  }
                });

              case 3:
                response = _context3.sent;

                if (!response.data) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt('return', response.data);

              case 8:
                if (!response.result) {
                  _context3.next = 12;
                  break;
                }

                return _context3.abrupt('return', response.result);

              case 12:
                return _context3.abrupt('return', response);

              case 13:
                _context3.next = 26;
                break;

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3['catch'](0);

                if (!(_context3.t0.response && _context3.t0.response.data && _context3.t0.response.data.error)) {
                  _context3.next = 21;
                  break;
                }

                return _context3.abrupt('return', _context3.t0.response.data.error.message);

              case 21:
                if (!(_context3.t0.response && _context3.t0.response.status && _context3.t0.response.statusText)) {
                  _context3.next = 25;
                  break;
                }

                return _context3.abrupt('return', _context3.t0.response.status + ' - ' + _context3.t0.response.statusText);

              case 25:
                return _context3.abrupt('return', "unknown error");

              case 26:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 15]]);
      }));

      function getFields(_x3) {
        return _ref3.apply(this, arguments);
      }

      return getFields;
    }()
  }, {
    key: 'send',
    value: function () {
      var _ref4 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(to, message) {
        var text, err;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this._debug) {
                  console.log({ recipient: { id: to }, message: message ? message.toJSON() : message });
                }

                _context4.prev = 1;
                _context4.next = 4;
                return (0, _fetch2.default)('https://graph.facebook.com/v2.6/me/messages', {
                  method: 'post',
                  json: true,
                  query: { access_token: this._token },
                  body: { recipient: { id: to }, message: message }
                });

              case 4:
                _context4.next = 15;
                break;

              case 6:
                _context4.prev = 6;
                _context4.t0 = _context4['catch'](1);

                if (!_context4.t0.text) {
                  _context4.next = 14;
                  break;
                }

                text = _context4.t0.text;

                try {
                  err = JSON.parse(_context4.t0.text).error;

                  text = (err.type || 'Unknown') + ': ' + (err.message || 'No message');
                } catch (ee) {
                  // ignore
                }

                throw Error(text);

              case 14:
                throw _context4.t0;

              case 15:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 6]]);
      }));

      function send(_x4, _x5) {
        return _ref4.apply(this, arguments);
      }

      return send;
    }()
  }, {
    key: 'senderAction',
    value: function () {
      var _ref5 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(to, _senderAction) {
        var text, err;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (this._debug) {
                  console.log({ recipient: { id: to }, senderAction: _senderAction });
                }

                _context5.prev = 1;
                _context5.next = 4;
                return (0, _fetch2.default)('https://graph.facebook.com/v2.6/me/messages', {
                  method: 'post',
                  json: true,
                  query: { access_token: this._token },
                  body: { recipient: { id: to }, sender_action: _senderAction }
                });

              case 4:
                _context5.next = 15;
                break;

              case 6:
                _context5.prev = 6;
                _context5.t0 = _context5['catch'](1);

                if (!_context5.t0.text) {
                  _context5.next = 14;
                  break;
                }

                text = _context5.t0.text;

                try {
                  err = JSON.parse(_context5.t0.text).error;

                  text = (err.type || 'Unknown') + ': ' + (err.message || 'No message');
                } catch (ee) {
                  // ignore
                }

                throw Error(text);

              case 14:
                throw _context5.t0;

              case 15:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[1, 6]]);
      }));

      function senderAction(_x6, _x7) {
        return _ref5.apply(this, arguments);
      }

      return senderAction;
    }()
  }, {
    key: 'setTyping',
    value: function () {
      var _ref6 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(to, isTyping) {
        var senderAction;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                senderAction = isTyping ? 'typing_on' : 'typing_off';

                this.senderAction(to, senderAction);

              case 2:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function setTyping(_x8, _x9) {
        return _ref6.apply(this, arguments);
      }

      return setTyping;
    }()
  }, {
    key: 'startTyping',
    value: function () {
      var _ref7 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(to) {
        return _regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this.setTyping(to, true);

              case 1:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function startTyping(_x10) {
        return _ref7.apply(this, arguments);
      }

      return startTyping;
    }()
  }, {
    key: 'stopTyping',
    value: function () {
      var _ref8 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(to) {
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                this.setTyping(to, false);

              case 1:
              case 'end':
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function stopTyping(_x11) {
        return _ref8.apply(this, arguments);
      }

      return stopTyping;
    }()
  }, {
    key: 'fetchUser',
    value: function () {
      var _ref9 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(id) {
        var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'first_name,last_name,profile_pic';
        var cache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var key, props, _ref10, body;

        return _regenerator2.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                key = id + fields;
                props = void 0;

                if (!(cache && userCache[key])) {
                  _context9.next = 7;
                  break;
                }

                props = userCache[key];
                props.fromCache = true;
                _context9.next = 14;
                break;

              case 7:
                _context9.next = 9;
                return (0, _fetch2.default)('https://graph.facebook.com/v2.6/' + id, {
                  query: { access_token: this._token, fields: fields }, json: true
                });

              case 9:
                _ref10 = _context9.sent;
                body = _ref10.body;


                props = body;
                props.fromCache = false;

                if (cache) {
                  userCache[key] = props;
                }

              case 14:
                return _context9.abrupt('return', props);

              case 15:
              case 'end':
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function fetchUser(_x12) {
        return _ref9.apply(this, arguments);
      }

      return fetchUser;
    }()
  }, {
    key: 'handleMessage',
    value: function () {
      var _ref11 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(input) {
        var _this2 = this;

        var body, message, postbackPayload, postback, attachments, location;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                body = JSON.parse((0, _stringify2.default)(input));

                // Get messaging if existis, otherwise gets standby

                message = body.entry[0].messaging ? body.entry[0].messaging[0] : body.entry[0].standby ? body.entry[0].standby[0] : null;

                // Show message in beggning of handle message

                console.log(">>> handleMessage");
                console.log(message);
                console.log("handleMessage <<<");

                message.raw = input;

                if (message.message) {
                  (0, _assign2.default)(message, message.message);
                  delete message.message;
                }

                message.sender.fetch = function () {
                  var _ref12 = (0, _bluebird.coroutine)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(fields, cache) {
                    var props;
                    return _regenerator2.default.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            _context10.next = 2;
                            return _this2.fetchUser(message.sender.id, fields, cache);

                          case 2:
                            props = _context10.sent;

                            (0, _assign2.default)(message.sender, props);
                            return _context10.abrupt('return', message.sender);

                          case 5:
                          case 'end':
                            return _context10.stop();
                        }
                      }
                    }, _callee10, _this2);
                  }));

                  return function (_x16, _x17) {
                    return _ref12.apply(this, arguments);
                  };
                }();

                // POSTBACK

                if (!message.postback) {
                  _context11.next = 13;
                  break;
                }

                message.isButton = true;

                postbackPayload = {};


                try {
                  postbackPayload = JSON.parse(message.postback.payload);
                  if (postbackPayload.hasOwnProperty('data')) {
                    message.postback = postbackPayload;
                    message.data = postbackPayload.data;
                    message.event = postbackPayload.event;
                    this.emit('postback', message.event, message, message.data);

                    if (postbackPayload.hasOwnProperty('event')) {
                      this.emit(message.event, message, message.data);
                    }
                  }
                } catch (e) {
                  console.log('ERROR parsing postback.payload', postbackPayload, e);
                  this.emit(message.postback.payload, message);
                }
                return _context11.abrupt('return');

              case 13:
                if (!message.read) {
                  _context11.next = 16;
                  break;
                }

                this.emit('read', message, message.read);
                return _context11.abrupt('return');

              case 16:
                if (!message.delivery) {
                  _context11.next = 22;
                  break;
                }

                (0, _assign2.default)(message, message.delivery);
                message.delivery = message.delivery.mids;

                delete message.delivery.mids;

                this.emit('delivery', message, message.delivery);
                return _context11.abrupt('return');

              case 22:
                if (!message.optin) {
                  _context11.next = 27;
                  break;
                }

                message.param = message.optin.ref || true;
                message.optin = message.param;
                this.emit('optin', message, message.optin);
                return _context11.abrupt('return');

              case 27:
                if (!(message.quick_reply && !message.is_echo)) {
                  _context11.next = 33;
                  break;
                }

                postback = {};


                try {
                  postback = JSON.parse(message.quick_reply.payload) || {};
                } catch (e) {
                  // ignore
                }

                message.isQuickReply = true;

                if (postback.hasOwnProperty('data')) {
                  message.postback = postback;
                  message.data = postback.data;
                  message.event = postback.event;

                  this.emit('postback', message.event, message, message.data);

                  if (postback.hasOwnProperty('event')) {
                    this.emit(message.event, message, message.data);
                  }
                } else {
                  this.emit('quick-reply', message, message.quick_reply);
                }

                return _context11.abrupt('return');

              case 33:
                attachments = _lodash2.default.groupBy(message.attachments, 'type');


                if (attachments.image) {
                  message.images = attachments.image.map(function (a) {
                    return a.payload.url;
                  });
                }

                if (attachments.video) {
                  message.videos = attachments.video.map(function (a) {
                    return a.payload.url;
                  });
                }

                if (attachments.audio) {
                  message.audio = attachments.audio.map(function (a) {
                    return a.payload.url;
                  })[0];
                }

                if (attachments.location) {
                  location = attachments.location[0];

                  message.location = (0, _extends3.default)({}, location, location.payload.coordinates);
                  delete message.location.payload;
                }

                message.object = body.object;

                delete message.attachments;

                if (this._debug) console.log('this.emit message', message);

                this.emit('message', message);

              case 42:
              case 'end':
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function handleMessage(_x15) {
        return _ref11.apply(this, arguments);
      }

      return handleMessage;
    }()
  }, {
    key: 'router',
    value: function router() {
      var _this3 = this;

      var router = new _express.Router();

      router.use(_bodyParser2.default.json());

      router.get('/', function (req, res) {
        if (req.query['hub.verify_token'] === _this3._verification) {
          res.send(req.query['hub.challenge']);
        } else {
          res.send('Error, wrong validation token');
        }
      });

      router.post('/', function (req, res) {
        _this3._token = req.token;
        _this3.handleMessage(req.body);
        if (_this3._debug) {
          console.log("bot router (req.body.entry[0])");
          console.log(req.body.entry && req.body.entry.length > 0 ? req.body.entry[0] : "received something, no body entry..");
        }
        res.send().status(200);
      });

      return router;
    }
  }]);
  return Bot;
}(_events2.default);

Bot.Buttons = _Buttons2.default;
Bot.Elements = _Elements2.default;
Bot.wait = wait;
exports.Bot = Bot;
exports.default = Bot;
//# sourceMappingURL=Bot.js.map
