/**
 * Copyright (c) 2013 - 2024 OVH SAS
 * Copyright (c) 2012 - 2013 Vincent Giersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Except as contained in this notice, the name of OVH and or its trademarks
 * shall not be used in advertising or otherwise to promote the sale, use or
 * other dealings in this Software without prior written authorization from OVH.
 */
'use strict';

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var https = require('https'),
  Bluebird = require('bluebird'),
  querystring = require('querystring'),
  crypto = require('crypto'),
  async = require('async'),
  endpoints = require('./endpoints');
var _require = require('simple-oauth2'),
  ClientCredentials = _require.ClientCredentials;
var Ovh = /*#__PURE__*/function () {
  function Ovh(params) {
    _classCallCheck(this, Ovh);
    this.endpoint = params.endpoint || null;
    // Preconfigured API endpoints
    if (this.endpoint) {
      if (!endpoints[this.endpoint]) {
        throw new Error('[OVH] Unknown API ' + this.endpoint);
      }
      for (var key in endpoints[this.endpoint]) {
        if (endpoints[this.endpoint].hasOwnProperty(key)) {
          params[key] = endpoints[this.endpoint][key];
        }
      }
    }

    //OAuth2
    if (params.clientID || params.clientSecret) {
      if (typeof params.clientID !== 'string' || typeof params.clientSecret !== 'string') {
        throw new Error('[OVH] Both clientID and clientSecret must be given');
      }
      if (!params.tokenURL) {
        throw new Error('[OVH] Endpoint does not support OAuth2 authentication');
      }
      this.oauthConfig = {
        client: {
          id: params.clientID,
          secret: params.clientSecret
        },
        auth: {
          tokenHost: params.tokenURL,
          tokenPath: "oauth2/token"
        }
      };
      this.oauthClient = new ClientCredentials(this.oauthConfig);
    }

    // Legacy Application Key authorization
    if (params.appKey || params.appSecret) {
      this.appKey = params.appKey;
      this.appSecret = params.appSecret;
      this.consumerKey = params.consumerKey || null;
      if (typeof this.appKey !== 'string' || typeof this.appSecret !== 'string') {
        throw new Error('[OVH] Both application key and application secret must be given');
      }
    }
    if (this.appKey && this.oauthConfig) {
      throw new Error('[OVH] Cannot use both applicationKey/applicationSecret and OAuth2');
    }
    if (!this.appKey && !this.oauthConfig) {
      throw new Error('[OVH] Missing authentication. You must provide applicationKey/applicationSecret or OAuth2 clientID/clientSecret');
    }
    this.timeout = params.timeout;
    this.apiTimeDiff = params.apiTimeDiff || null;

    // Custom configuration of the API endpoint
    this.host = params.host || 'eu.api.ovh.com';
    this.port = params.port || 443;
    this.basePath = params.basePath || '/1.0';

    // Declared used API, will be used to check the associated schema
    this.usedApi = params.apis || [];
    if (Array.isArray(this.usedApi) && this.usedApi.length > 0 && this.usedApi.indexOf('auth') < 0) {
      this.usedApi.push('auth');
    }

    // Get warnings from the modules (e.g. deprecated API method)
    this.warn = params.warn || console.log;
    this.debug = params.debug || false;

    // istanbul ignore next
    if (this.debug && typeof this.debug !== 'function') {
      this.debug = console.log;
    }
    this.apis = {
      _path: ''
    };
    this.apisLoaded = !this.usedApi.length;
  }

  /**
   * Returns the endpoint's full path, if the endpoint's path starts
   * with /v1 or /v2, remove the trailing '/1.0' from the basePath
   */
  return _createClass(Ovh, [{
    key: "getFullPath",
    value: function getFullPath(path) {
      if ((this.basePath || '').endsWith('/1.0') && /^\/v(1|2)/.test(path)) {
        return "".concat(this.basePath.slice(0, -4)).concat(path);
      }
      return "".concat(this.basePath).concat(path);
    }

    /**
     * Recursively loads the schemas of the specified used APIs.
     *
     * @param {String} path
     * @param {Function} callback
     */
  }, {
    key: "loadSchemas",
    value: function loadSchemas(path, callback) {
      var _this = this;
      var request = {
        host: this.host,
        port: this.port,
        path: this.getFullPath(path)
      };

      // Fetch only selected APIs
      if (path === '/') {
        return async.each(this.usedApi, function (apiName, callback) {
          _this.loadSchemas('/' + apiName + '.json', callback);
        }, callback);
      }

      // Fetch all APIs
      this.loadSchemasRequest(request, function (err, schema) {
        if (err) {
          return callback(err, path);
        }
        async.each(schema.apis, function (api, callback) {
          var apiPath = api.path.split('/');
          _this.addApi(apiPath, api, _this.apis);
          callback(null);
        }, callback);
      });
    }

    /**
     * Add a fetched schema to the loaded API list
     *
     * @param {Array} apiPath: Splited API path using '/'
     * @param {String} api: API Name
     * @param {Function} callback
     */
  }, {
    key: "addApi",
    value: function addApi(apiPath, api, apis) {
      var path = apiPath.shift();
      if (path === '') {
        return this.addApi(apiPath, api, apis);
      }
      if (apis[path] == null) {
        apis[path] = {
          _path: apis._path + '/' + path
        };
      }
      if (apiPath.length > 0) {
        return this.addApi(apiPath, api, apis[path]);
      }
      apis[path]._api = api;
    }

    /**
     * Fetch an API schema
     *
     * @param {Object} options: HTTP request options
     * @param {Function} callback
     */
  }, {
    key: "loadSchemasRequest",
    value: function loadSchemasRequest(options, callback) {
      https.get(options, function (res) {
        var body = '';
        res.on('data', function (chunk) {
          return body += chunk;
        }).on('end', function () {
          try {
            body = JSON.parse(body);
          } catch (e) {
            if (res.statusCode !== 200) {
              return callback('[OVH] Unable to load schema ' + options.path + ', HTTP response code: ' + res.statusCode, res.statusCode);
            } else {
              return callback('[OVH] Unable to parse the schema: ' + options.path);
            }
          }
          return callback(null, body);
        });
      }).on('error', /* istanbul ignore next */function (err) {
        return callback('[OVH] Unable to fetch the schemas: ' + err);
      });
    }

    /**
     * Generates warns from the loaded API schema when processing a request
     *
     * A warn is generated when the API schema is loaded and:
     *  - The API method does not exists
     *  - The API method is not available with the provided httpMethod
     *  - The API method is tagged as deprecated in the schema
     *
     * The function called can be customzied by providing a function using the
     * 'warn' parameter when instancing the module. Default function used is
     * 'console.warn'.
     *
     * @param {String} httpMethod
     * @param {String} pathStr
     */
  }, {
    key: "warnsRequest",
    value: function warnsRequest(httpMethod, pathStr) {
      var path = pathStr.split('/'),
        api = this.apis;
      while (path.length > 0) {
        var pElem = path.shift();
        if (pElem === '') {
          continue;
        }
        if (api[pElem] != null) {
          api = api[pElem];
          continue;
        }
        var keys = Object.keys(api);
        for (var i = 0; i < keys.length; ++i) {
          if (keys[i].charAt(0) === '{') {
            api = api[keys[i]];
            keys = null;
            break;
          }
        }
        if (keys) {
          return this.warn('[OVH] Your call ' + pathStr + ' was not found in the API schemas.');
        }
      }
      if (!api._api || !api._api.operations) {
        return this.warn('[OVH] Your call ' + pathStr + ' was not found in the API schemas.');
      }
      for (var _i = 0; _i < api._api.operations.length; ++_i) {
        if (api._api.operations[_i].httpMethod === httpMethod) {
          if (api._api.operations[_i].apiStatus.value === 'DEPRECATED') {
            var status = api._api.operations[_i].apiStatus;
            return this.warn('[OVH] Your API call ' + pathStr + ' is tagged DEPRECATED since ' + status.deprecatedDate + ' and will deleted on ' + status.deletionDate, '. You can replace it with ' + status.replacement);
          }
          if (typeof this.consumerKey !== 'string' && !api._api.operations[_i].noAuthentication) {
            return this.warn('[OVH] The API call ' + pathStr + ' requires an authentication' + ' with a consumer key.');
          }
          return true;
        }
      }
      return this.warn('[OVH] The method ' + httpMethod + ' for the API call ' + pathStr + ' was not found in the API schemas.');
    }

    /**
     * Execute a request on the API
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Object} params: The request parameters (passed as query string or
     *                         body params)
     * @param {Function} callback
     * @param {Object} refer: The parent proxied object
     */
  }, {
    key: "request",
    value: (function () {
      var _request = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(httpMethod, path, params, callback, refer) {
        var _this2 = this;
        var newPath, paramKey, options, k, reqBody, req;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (callback == null) {
                callback = params;
              }

              // Schemas
              if (this.apisLoaded) {
                _context.next = 3;
                break;
              }
              return _context.abrupt("return", this.loadSchemas('/', function (err) {
                if (err) {
                  return callback(err);
                }
                _this2.apisLoaded = true;
                return _this2.request(httpMethod, path, params, callback, refer);
              }));
            case 3:
              if (!(!this.oauthConfig && this.apiTimeDiff === null && path !== '/auth/time')) {
                _context.next = 5;
                break;
              }
              return _context.abrupt("return", this.request('GET', '/auth/time', {}, function (err, time) {
                if (err) {
                  return callback('[OVH] Unable to fetch OVH API time');
                }
                _this2.apiTimeDiff = time - Math.round(Date.now() / 1000);
                return _this2.request(httpMethod, path, params, callback, refer);
              }, refer));
            case 5:
              // Potential warnings
              if (Object.keys(this.apis).length > 1) {
                this.warnsRequest(httpMethod, path);
              }

              // Replace "{str}", used for $call()
              if (path.indexOf('{') >= 0) {
                newPath = path;
                for (paramKey in params) {
                  if (params.hasOwnProperty(paramKey)) {
                    newPath = path.replace('{' + paramKey + '}', params[paramKey]);

                    // Remove from body parameters
                    if (newPath !== path) {
                      delete params[paramKey];
                    }
                    path = newPath;
                  }
                }
              }
              options = {
                host: this.host,
                port: this.port,
                method: httpMethod,
                path: this.getFullPath(path),
                headers: {}
              };
              if (!this.oauthConfig) {
                options.headers = {
                  'Content-Type': 'application/json',
                  'X-Ovh-Application': this.appKey
                };
              }

              // Remove undefined values
              for (k in params) {
                if (params.hasOwnProperty(k) && params[k] == null) {
                  delete params[k];
                }
              }
              reqBody = null;
              if (_typeof(params) === 'object' && Object.keys(params).length > 0) {
                if (httpMethod === 'PUT' || httpMethod === 'POST') {
                  // Escape unicode
                  reqBody = JSON.stringify(params).replace(/[\u0080-\uFFFF]/g, function (m) {
                    return "\\u" + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
                  });
                  options.headers['Content-Length'] = reqBody.length;
                } else {
                  options.path += '?' + querystring.stringify(params);
                }
              }
              if (!(this.oauthConfig && (!this.accessToken || this.accessToken.expired(10)))) {
                _context.next = 22;
                break;
              }
              _context.prev = 13;
              _context.next = 16;
              return this.oauthClient.getToken({
                scope: "all"
              });
            case 16:
              this.accessToken = _context.sent;
              _context.next = 22;
              break;
            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](13);
              return _context.abrupt("return", callback({
                statusCode: _context.t0.output && _context.t0.output.statusCode,
                error: _context.t0.output && _context.t0.output.payload.error,
                message: _context.t0.data.payload
              }));
            case 22:
              if (this.accessToken) {
                options.headers.Authorization = "Bearer ".concat(this.accessToken.token.access_token);
              }
              if (path.indexOf('/auth') < 0 && !this.accessToken) {
                options.headers['X-Ovh-Timestamp'] = Math.round(Date.now() / 1000) + this.apiTimeDiff;

                // Sign request
                if (typeof this.consumerKey === 'string') {
                  options.headers['X-Ovh-Consumer'] = this.consumerKey;
                  options.headers['X-Ovh-Signature'] = this.signRequest(httpMethod, 'https://' + options.host + options.path, reqBody, options.headers['X-Ovh-Timestamp']);
                }
              }
              if (this.debug) {
                this.debug('[OVH] API call:', options.method, options.path, reqBody || '');
              }
              req = https.request(options, function (res) {
                var body = '';
                res.on('data', function (chunk) {
                  return body += chunk;
                });
                res.on('end', function () {
                  var response;
                  if (body.length > 0) {
                    try {
                      response = JSON.parse(body);
                    } catch (e) {
                      return callback('[OVH] Unable to parse JSON reponse');
                    }
                  } else {
                    response = null;
                  }
                  if (_this2.debug) {
                    _this2.debug('[OVH] API response to', options.method, options.path, ':', body);
                  }
                  if (res.statusCode > 299 || res.statusCode < 200) {
                    callback(res.statusCode, response ? response.message : response);
                  } else {
                    // Return a proxy (for potential next request)
                    if (refer != null) {
                      _this2.proxyResponseREST(response, refer, callback);
                    } else {
                      callback(null, response);
                    }
                  }
                });
              }); // istanbul ignore next
              req.on('error', function (e) {
                return callback(e.errno || e);
              });

              // istanbul ignore next
              // mocked socket has no setTimeout
              if (typeof this.timeout === 'number') {
                req.on('socket', function (socket) {
                  socket.setTimeout(_this2.timeout);
                  if (socket._events.timeout != null) {
                    socket.on('timeout', function () {
                      return req.abort();
                    });
                  }
                });
              }
              if (reqBody != null) {
                req.write(reqBody);
              }
              req.end();
            case 30:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[13, 19]]);
      }));
      function request(_x, _x2, _x3, _x4, _x5) {
        return _request.apply(this, arguments);
      }
      return request;
    }()
    /**
     * Execute a request on the API with promise
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Object} params: The request parameters (passed as query string or
     *                         body params)
     */
    )
  }, {
    key: "requestPromised",
    value: function requestPromised(httpMethod, path, params) {
      var _this3 = this;
      return new Bluebird(function (resolve, reject) {
        return _this3.request(httpMethod, path, params, function (error, resp) {
          if (error) {
            return reject({
              error: error,
              message: resp
            });
          }
          return resolve(resp);
        });
      });
    }

    /**
     * Signs an API request
     *
     * @param {String} httpMethod
     * @param {String} url
     * @param {String} body
     * @param {Number|String} timestamp
     * @return {String} The signature
     */
  }, {
    key: "signRequest",
    value: function signRequest(httpMethod, url, body, timestamp) {
      var s = [this.appSecret, this.consumerKey, httpMethod, url, body || '', timestamp];
      return '$1$' + crypto.createHash('sha1').update(s.join('+')).digest('hex');
    }
  }]);
}();
module.exports = function (params) {
  return new Ovh(params || {});
};
