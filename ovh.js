//
// node-ovh
//
// @version 0.3.0
// @author Vincent Giersch <mail@vincent.sh>
// @license MIT
//

var https = require('https'),
    querystring = require('querystring'),
    url = require('url'),
    crypto = require('crypto'),
    handlerMaker = require('./handler-maker');

if (typeof(Proxy) === 'undefined') {
  console.error("Please run node with --harmony-proxies flag");
}

(function () {
  "use strict";

  function OVHWS(wsList, apiKeys) {
    this.apiKeys = { appKey: apiKeys.appKey, appSecret: apiKeys.appSecret,
                     consumerKey: apiKeys.consumerKey || null,
                     credentialToken: apiKeys.credentialToken || null };
    this.wsList = {};
    this.wsMetas = {};

    // Check and add implicit params in wsList
    for (var apiName in wsList) {
      if (wsList.hasOwnProperty(apiName)) {

        // Backward compatibility with <= v0.2, use as WS
        if (typeof(wsList[apiName]) === 'string') {
          this.wsList[apiName] = { type: 'WS', path: wsList[apiName], host: 'ws.ovh.com' };
        }
        else if (typeof(wsList[apiName]) === 'object') {
          // Type and path
          if (typeof(wsList[apiName].type) === 'undefined') {
            throw new Error('OVH: `type` is a compulsory parameter');
          }

          if (wsList[apiName].type !== 'WS' && wsList[apiName].type !== 'REST') {
            throw new Error('OVH: types supported are (WS|REST)');
          }

          if (typeof(wsList[apiName].path) === 'undefined') {
            throw new Error('OVH: `path` is a compulsory parameter');
          }

          this.wsList[apiName] = { type: wsList[apiName].type, path: wsList[apiName].path, host: wsList[apiName].host };

          // Host, baseName for REST
          if (this.wsList[apiName].type === 'REST') {
            // Check for appKey or appSecret for REST usage
            if (typeof(this.apiKeys.appKey) !== 'string' || typeof(this.apiKeys.appSecret) !== 'string') {
              throw new Error('OVH API: You should precise an application key / secret');
            }

            if (typeof(wsList[apiName].host) === 'string') {
              var host = url.parse(wsList[apiName].host);

              if (typeof(host.host) === 'string') {
                this.wsList[apiName].host = host.host;

                if (host.slashes) {
                  this.wsList[apiName].basePath = host.pathname;
                }
              }
              else {
                this.wsList[apiName].host = wsList[apiName].host;
              }
            }

            if (typeof(wsList[apiName].basePath) === 'string') {
              this.wsList[apiName].basePath = wsList[apiName].basePath;
            }

            // Default values
            if (typeof(this.wsList[apiName].host) === 'undefined') {
              this.wsList[apiName].host = 'api.ovh.com';
            }

            if (typeof(this.wsList[apiName].basePath) === 'undefined') {
              this.wsList[apiName].basePath = '/1.0';
            }
          }
          // Host for WS
          else {
            if (typeof(this.wsList[apiName].host) !== 'string') {
              this.wsList[apiName].host = 'ws.ovh.com';
            }
          }
        }
      }
    }

    return this.createRootProxy();
  }

  // Default REST actions
  OVHWS.prototype.actionsREST = {
    'get': 'GET',
    'query': 'GET',
    'post': 'POST',
    'put': 'PUT',
    'remove': 'DELETE',
    'delete': 'DELETE'
  };

  // Create handler for root proxy (OVHWS.{ws-name}.{method}{.call,})
  OVHWS.prototype.createRootProxy = function () {
    // Proxy
    var handler = handlerMaker(this),
        _this = this;

    // Catch WS name
    handler.get = function (target, name) {
      if (typeof(_this[name]) !== 'undefined') {
        return _this[name];
      }

      if (_this.wsList[name] === undefined) {
        return undefined;
      }

      // Catch WS method name
      if (_this.wsList[name].type === 'WS') {
        var handler = handlerMaker();
        handler.$ws = name;
        handler.get = function (target, name) {
          var ws = this.$ws;
          return {
            call: function (params, callback) {
              return _this.callWS(ws, name, params, callback);
            }
          };
        };

        return Proxy.create(handler);
      }
      else {
        return _this.proxyREST(target, name);
      }
    };

    return Proxy.create(handler);
  };

  OVHWS.prototype.proxyREST = function (target, name, reuseHandler) {
    var _this = this,
        handler = handlerMaker();

    // Root
    if (typeof(target.wsList) !== 'undefined') {
      handler.$api = name;
      handler.$path = [name];
    }
    // Sub level
    else {
      if (typeof(reuseHandler) !== 'undefined' && reuseHandler) {
        handler = target;
      }
      else {
        handler = handlerMaker(target);
        handler.$api = target.$api;
        handler.$path = [];
        for (var i = 0 ; i < target.$path.length ; ++i) {
          handler.$path.push(target.$path[i]);
        }
      }

      if (typeof(name) !== 'undefined') {
        handler.$path.push(name);
      }
    }

    handler.$params = {};

    handler.get = function (target, name) {
      var _handler = this;

      // Existing
      if (typeof(_this[name]) !== 'undefined') {
        return _this[name];
      }

      if (typeof(this.$value) !== 'undefined' && typeof(this.$value[name]) !== 'undefined') {
        return this.$value[name];
      }

      // Action
      if (typeof(this.wsList) === 'undefined' && name === 'call' || name === '$call') {
        return function (httpMethod, path, params, callback) {
          _this.callREST(_handler.$api, httpMethod, path,
                         typeof(params) === 'function' ? {} : params,
                         typeof(params) === 'function' ? params : callback);
        };
      }
      else if (name.charAt(0) === '$') {
        var strippedName = name.substring(1);
        if (_this.actionsREST.hasOwnProperty(strippedName)) {
          return function (params, callback) {
            // Already set parameters
            if (typeof(params) !== 'function') {
              for (var key in params) {
                if (params.hasOwnProperty(key)) {
                  _handler.$params[key] = params[key];
                }
              }
            }

            _this.callREST(_handler.$api, _this.actionsREST[strippedName],
                           '/' + _handler.$path.join('/'),
                           _handler.$params,
                           typeof(params) === 'function' ? params : callback,
                           _handler);
          };
        }
      }
      else {
        return _this.proxyREST(this, name);
      }
    };

    handler.set = function (target, name, value) {
      this.$params[name] = value;
    };

    return Proxy.create(handler);
  };

  OVHWS.prototype.proxyResponseHandlerREST = function (refer, object) {
    if (typeof(object) !== 'object' || object === null) {
      return object;
    }

    var handler = handlerMaker(object);
    handler.$value = object;
    handler.$api = refer.$api;
    handler.$path = [];
    for (var i = 0 ; i < refer.$path.length ; ++i) {
      handler.$path.push(refer.$path[i]);
    }

    return this.proxyREST(handler, undefined, true);
  };

  OVHWS.prototype.proxyResponseREST = function (response, refer, callback) {
    if (Object.prototype.toString.call(response) === '[object Array]') {
      var result = [];
      for (var i = 0 ; i < response.length ; ++i) {
        result.push(this.proxyResponseHandlerREST(refer, response[i], response[i]));
      }

      callback.call(this.proxyResponseHandlerREST(refer, response), true, result);
    }
    else {
      var proxy = this.proxyResponseHandlerREST(refer, response);
      callback.call(proxy, true, proxy);
    }
  };

  OVHWS.prototype.setClientCredentials = function (consumerKey, credentialToken) {
    this.credentialToken = credentialToken;
    this.consumerKey = consumerKey;
  };

  // Call REST API
  OVHWS.prototype.callREST = function (apiName, httpMethod, path, params, callback, refer) {
    if (apiName !== 'auth' && (typeof(this.apiKeys.credentialToken) !== 'string' ||
                               typeof(this.apiKeys.consumerKey) !== 'string')) {
      throw new Error('OVH API: No consumerKey / credentialToken defined.');
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
      host: this.wsList[apiName].host,
      port: 443,
      method: httpMethod,
      path: this.wsList[apiName].basePath + path
    };

    // Headers
    options.headers = {
      'Content-Type': 'application/json',
      'X-Ovh-Application': this.apiKeys.appKey,
    };

    if (typeof(params) === 'object' && Object.keys(params).length > 0) {
      options.headers['Content-Length'] = JSON.stringify(params).length; // Enjoy 500 on chunked requests...
    }

    // Sign request
    if (apiName !== 'auth') {
      options.headers['X-Ovh-Consumer'] = this.apiKeys.consumerKey;
      options.headers['X-Ovh-Timestamp'] = Math.round(Date.now() / 1000);
      options.headers['X-Ovh-Signature'] = this.signREST(httpMethod, 'https://' + options.host + options.path,
                                                         params, options.headers['X-Ovh-Timestamp']);
    }

    var _this = this;
    var req = https.request(options, function (res) {
      var body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        var response;

        try {
          response = JSON.parse(body);
        } catch (e) {
          if (res.statusCode !== 200) {
            callback(false, res.statusCode);
          }
          else {
            callback(false, 'Unable to parse JSON reponse');
          }
          return false;
        }

        if (res.statusCode !== 200) {
          callback(false, res.statusCode, response.message);
        }
        else {
          // Return a proxy (for potential next request)
          if (typeof(refer) !== 'undefined') {
            _this.proxyResponseREST(response, refer, callback);
          }
          else {
            callback(true, response);
          }
        }
      });
    });

    req.on('error', function (e) {
      callback(false, e.errno);
    });

    if (typeof(params) === 'object' && Object.keys(params).length > 0) {
      req.write(JSON.stringify(params));
    }

    req.end();
  };

  // Sign a REST request
  OVHWS.prototype.signREST = function (httpMethod, url, params, timestamp) {
    var s = [
      this.apiKeys.credentialToken,
      httpMethod,
      url,
      typeof(params) === 'object' && Object.keys(params).length > 0 ? JSON.stringify(params) : '',
      timestamp
    ];

    return '$1$' + crypto.createHash('sha1').update(s.join('+')).digest('hex');
  };

  // Call a WS
  OVHWS.prototype.callWS = function (ws, method, params, callback) {
    var options = {
      host: this.wsList[ws].host,
      port: 443,
      method: 'GET',
      path: '/' + this.wsList[ws].path + '/rest.dispatcher/' + method + '?' + querystring.stringify({ params: JSON.stringify(params) })
    };

    var req = https.request(options, function (res) {
      if (res.statusCode !== 200) {
        callback(false, 'HTTP error code ' + res.statusCode);
      }
      else {
        var body = '';
        res.on('data', function (chunk) {
          body += chunk;
        });

        res.on('end', function () {
          var response;

          try {
            response = JSON.parse(body);
          } catch (e) {
            callback(false, 'Unable to parse JSON reponse');
            return false;
          }

          if (response.error) {
            callback(false, response.error);
          }
          else {
            callback(true, response.answer);
          }
        });
      }
    });

    req.on('error', function (e) {
      callback(false, e.errno);
    });

    req.end();
  };

  // Check the existence of WS schemas
  // @param callback(wsPrefix, success, errorMsg)
  OVHWS.prototype.checkWS = function (callback) {
    var _this = this;

    var checkWS = function (k) {
      var options = {
        host: _this.wsList[k].host,
        port: 443,
        method: 'GET'
      };

      if (_this.wsList[k].type === 'REST') {
        options.path = (_this.wsList[k].basePath || '/') + _this.wsList[k].path + '.json';
      }
      else {
        options.path = '/' + _this.wsList[k].path + '/schema.json';
      }

      var _k = k;

      var req = https.request(options, function (res) {
        if (res.statusCode !== 200) {
          callback(k, false, 'Unable to find WS ' + _this.wsList[k]);
        }
        else {
          var body = '';
          res.on('data', function (chunk) {
            body += chunk;
          });

          res.on('end', function () {
            var wsMeta = JSON.parse(body);
            callback(k, true);
            _this.wsMetas[k] = wsMeta;
          });
        }
      });

      req.on('error', function (e) {
        callback(k, false, 'Unable to fetch WS schema ' + _this.wsList[k]);
      });

      req.end();
    };

    for (var k in this.wsList) {
      if (this.wsList.hasOwnProperty(k)) {
        checkWS(k);
      }
    }
  };

  module.exports = function (wsList, apiKeys) {
    return new OVHWS(wsList, apiKeys || {});
  };

}).call(this);
