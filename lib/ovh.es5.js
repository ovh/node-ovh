/**
 * Copyright (c) 2013 - 2016 OVH SAS
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

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var https = require('https'),
    Bluebird = require('bluebird'),
    querystring = require('querystring'),
    url = require('url'),
    crypto = require('crypto'),
    async = require('async'),
    handlerMaker = require('./handler-maker'),
    endpoints = require('./endpoints');

var Ovh = function () {
  function Ovh(params) {
    _classCallCheck(this, Ovh);

    this.appKey = params.appKey;
    this.appSecret = params.appSecret;
    this.consumerKey = params.consumerKey || null;
    this.timeout = params.timeout;
    this.apiTimeDiff = params.apiTimeDiff || null;
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

    this.apis = { _path: '' };
    this.apisLoaded = !this.usedApi.length;

    if (typeof this.appKey !== 'string' || typeof this.appSecret !== 'string') {
      throw new Error('[OVH] You should precise an application key / secret');
    }
  }

  /**
   * Recursively loads the schemas of the specified used APIs.
   *
   * @param {String} path
   * @param {Function} callback
   */


  _createClass(Ovh, [{
    key: 'loadSchemas',
    value: function loadSchemas(path, callback) {
      var _this = this;

      var request = {
        host: this.host,
        port: this.port,
        path: this.basePath + path
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
    key: 'addApi',
    value: function addApi(apiPath, api, apis) {
      var path = apiPath.shift();
      if (path === '') {
        return this.addApi(apiPath, api, apis);
      }

      if (apis[path] == null) {
        apis[path] = { _path: apis._path + '/' + path };
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
    key: 'loadSchemasRequest',
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
    key: 'warnsRequest',
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
    key: 'request',
    value: function request(httpMethod, path, params, callback, refer) {
      var _this2 = this;

      if (callback == null) {
        callback = params;
      }

      // Schemas
      if (!this.apisLoaded) {
        return this.loadSchemas('/', function (err) {
          if (err) {
            return callback(err);
          }

          _this2.apisLoaded = true;
          return _this2.request(httpMethod, path, params, callback, refer);
        });
      }

      // Time drift
      if (this.apiTimeDiff === null && path !== '/auth/time') {
        return this.request('GET', '/auth/time', {}, function (err, time) {
          if (err) {
            return callback('[OVH] Unable to fetch OVH API time');
          }

          _this2.apiTimeDiff = time - Math.round(Date.now() / 1000);
          return _this2.request(httpMethod, path, params, callback, refer);
        }, refer);
      }

      // Potential warnings
      if (Object.keys(this.apis).length > 1) {
        this.warnsRequest(httpMethod, path);
      }

      // Replace "{str}", used for $call()
      if (path.indexOf('{') >= 0) {
        var newPath = path;

        for (var paramKey in params) {
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

      var options = {
        host: this.host,
        port: this.port,
        method: httpMethod,
        path: this.basePath + path
      };

      // Headers
      options.headers = {
        'Content-Type': 'application/json',
        'X-Ovh-Application': this.appKey
      };

      // Remove undefined values
      for (var k in params) {
        if (params.hasOwnProperty(k) && params[k] == null) {
          delete params[k];
        }
      }

      var reqBody = null;
      if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object' && Object.keys(params).length > 0) {
        if (httpMethod === 'PUT' || httpMethod === 'POST') {
          // Escape unicode
          reqBody = JSON.stringify(params).replace(/[\u0080-\uFFFF]/g, function (m) {
            return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
          });
          options.headers['Content-Length'] = reqBody.length;
        } else {
          options.path += '?' + querystring.stringify(params);
        }
      }

      if (path.indexOf('/auth') < 0) {
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

      var req = https.request(options, function (res) {
        var body = '';

        res.on('data', function (chunk) {
          return body += chunk;
        });

        res.on('end', function () {
          var response = void 0;

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

          if (res.statusCode !== 200) {
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
      });

      // istanbul ignore next
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
    }

    /**
     * Execute a request on the API with promise
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Object} params: The request parameters (passed as query string or
     *                         body params)
     */

  }, {
    key: 'requestPromised',
    value: function requestPromised(httpMethod, path, params) {
      var _this3 = this;

      return new Bluebird(function (resolve, reject) {
        return _this3.request(httpMethod, path, params, function (error, resp) {
          if (error) {
            return reject({ error: error, message: resp });
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
    key: 'signRequest',
    value: function signRequest(httpMethod, url, body, timestamp) {
      var s = [this.appSecret, this.consumerKey, httpMethod, url, body || '', timestamp];

      return '$1$' + crypto.createHash('sha1').update(s.join('+')).digest('hex');
    }
  }]);

  return Ovh;
}();

module.exports = function (params) {
  return new Ovh(params || {});
};
