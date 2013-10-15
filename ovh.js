//
// node-ovh
//
// @version 1.0.0
// @author Vincent Giersch <mail@vincent.sh>
// @license MIT
//

var https = require('https'),
    querystring = require('querystring'),
    url = require('url'),
    crypto = require('crypto'),
    async = require('async'),
    handlerMaker = require('./handler-maker');

(function () {
  "use strict";

  function Ovh(params) {
    this.appKey = params.appKey;
    this.appSecret = params.appSecret;
    this.consumerKey = params.consumerKey || null;
    this.timeout = params.timeout;
    this.apiTimeDiff = params.apiTimeDiff || null;

    this.host = params.host || 'api.ovh.com';
    this.port = params.port || 443;
    this.basePath = params.basePath || '/1.0';
    this.usedApi = params.apis || [];

    this.warn = params.warn || console.log;
    this.debug = params.debug || false;
    if (this.debug && typeof(this.debug) !== 'function') {
      this.debug = console.log;
    }

    this.apis = { _path: '' };
    this.apisLoaded = !this.usedApi.length;

    if (typeof(this.appKey) !== 'string' ||
        typeof(this.appSecret) !== 'string') {
      throw new Error('[OVH] You should precise an application key / secret');
    }

    if (typeof(Proxy) !== 'undefined') {
      return this.createRootProxy();
    }
  }

  Ovh.prototype.loadSchemas = function (path, callback) {
    var request = {
      host: this.host,
      port: this.port,
      path: this.basePath + path
    };

    // Fetch ony selected APIs
    if (path === '/') {
      return async.each(
        this.usedApi,
        function (apiName, callback) {
          this.loadSchemas('/' + apiName + '.json', callback);
        }.bind(this),
        callback
      );
    }

    // Fetch all APIs
    this.loadSchemasRequest(request, function (err, schema) {
      if (err) {
        throw err;
      }

      async.each(
        schema.apis,
        function (api, callback) {
          if (api.schema) {
            this.loadSchemas(api.path + '.json', callback);
          }
          else {
            var apiPath = api.path.split('/');
            this.addApi(apiPath, api, this.apis);
            callback(null);
          }
        }.bind(this),
        function (err) {
          callback(err);
        }
      );
    }.bind(this));
  };

  Ovh.prototype.addApi = function (apiPath, api, apis) {
    var path = apiPath.shift();
    if (path === '') {
      return this.addApi(apiPath, api, apis);
    }

    if (typeof (apis[path]) === 'undefined') {
      apis[path] = { _path: apis._path + '/' + path };
    }

    if (apiPath.length > 0) {
      return this.addApi(apiPath, api, apis[path]);
    }

    apis[path]._api = api;
  };

  Ovh.prototype.loadSchemasRequest = function (options, callback) {
    https.get(options, function (res) {
      var body = '';
      res.on('data', function (chunk) {
        body += chunk;
      })
      .on('end', function () {
        try {
          body = JSON.parse(body);
        } catch (e) {
          if (res.statusCode !== 200) {
            callback('[OVH] HTTP code is : ' + res.statusCode, res.statusCode);
          }
          else {
            callback('[OVH] Unable to parse the schema: ' + options.path);
          }
        }

        callback(null, body);
      });
    })
    .on('error', function (err) {
      callback('[OVH] Unable to fetch the schemas: ' + err);
    });
  };

  // Default REST actions
  Ovh.prototype.actionsREST = {
    'get': 'GET',
    'query': 'GET',
    'post': 'POST',
    'put': 'PUT',
    'remove': 'DELETE',
    'delete': 'DELETE'
  };

  // Create handler for root proxy (Ovh.{apiName}.{method}{.call,})
  Ovh.prototype.createRootProxy = function () {
    var handler = handlerMaker(this);

    // Catch API name
    handler.get = function (target, name) {
      if (typeof(this[name]) !== 'undefined') {
        return this[name];
      }

      return this.proxyREST(target, name);
    }.bind(this);

    return Proxy.create(handler);
  };

  Ovh.prototype.proxyREST = function (target, name, reuseHandler) {
    var _this = this,
        handler = handlerMaker();

    // Root
    if (typeof(target.apis) !== 'undefined') {
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

      if (typeof(this.$value) !== 'undefined' &&
          Object.prototype.toString.call(this.$value) !== '[object Array]' &&
          typeof(this.$value[name]) !== 'undefined') {
        return this.$value[name];
      }

      // Action
      if (name.charAt(0) === '$') {
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

            _this.request(_this.actionsREST[strippedName],
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

  Ovh.prototype.proxyResponseHandlerREST = function (refer, object) {
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

  Ovh.prototype.proxyResponseREST = function (response, refer, callback) {
    if (Object.prototype.toString.call(response) === '[object Array]') {
      var result = [];
      for (var i = 0 ; i < response.length ; ++i) {
        result.push(this.proxyResponseHandlerREST(refer, response[i]));
      }

      callback.call(this.proxyResponseHandlerREST(refer, response), null, result);
    }
    else {
      var proxy = this.proxyResponseHandlerREST(refer, response);
      callback.call(proxy, null, proxy);
    }
  };

  Ovh.prototype.getSchema = function (path) {
    console.log('getSchema', path);
  };

  Ovh.prototype.warnsRequest = function (httpMethod, pathStr) {
    var path = pathStr.split('/'),
        api = this.apis,
        i;

    while (path.length > 0) {
      var pElem = path.shift();
      if (pElem === '') {
        continue;
      }

      if (typeof(api[pElem]) !== 'undefined') {
        api = api[pElem];
        continue;
      }

      var keys = Object.keys(api);
      for (i = 0 ; i < keys.length ; ++i) {
        if (keys[i].charAt(0) === '{') {
          api = api[keys[i]];
          keys = null;
          break;
        }
      }

      if (keys) {
        return this.warn(
          '[OVH] Your call ' + pathStr + ' was not found in the API schemas.'
        );
      }
    }


    if (typeof(api._api) === 'undefined' ||
        typeof(api._api.operations) === 'undefined') {
      return this.warn(
        '[OVH] Your call ' + pathStr + ' was not found in the API schemas.'
      );
    }

    for (i = 0 ; i < api._api.operations.length ; ++i) {
      if (api._api.operations[i].httpMethod === httpMethod) {
        if (api._api.operations[i].apiStatus.value === 'DEPRECATED') {
          var status = api._api.operations[i].apiStatus;
          return this.warn(
            '[OVH] Your API call ' + pathStr + ' is tagged DEPRECATED since ' +
            status.deprecatedDate +
            ' and will deleted on ' + status.deletionDate,
            '. You can replace it with ' + status.replacement
          );
        }

        return true;
      }
    }

    return this.warn(
      '[OVH] The method ' + httpMethod + ' for the API call ' +
      pathStr + ' was not found in the API schemas.'
    );
  };

  Ovh.prototype.request = function (httpMethod, path, params, callback, refer) {
    if (typeof(callback) === 'undefined') {
      callback = params;
    }

    // Schemas
    if (!this.apisLoaded) {
      return this.loadSchemas('/', function (err) {
        if (err) {
          return callback(err);
        }

        this.apisLoaded = true;
        return this.request(httpMethod, path, params, callback, refer);
      }.bind(this));
    }

    // Potential warnings
    if (Object.keys(this.apis).length > 1) {
      this.warnsRequest(httpMethod, path);
    }
    
    // Time drift
    if (this.apiTimeDiff === null && path !== '/auth/time') {
      return this.request('GET', '/auth/time', {}, function (err, time) {
        if (err) {
          return callback('[OVH] Unable to fetch OVH API time');
        }

        this.apiTimeDiff = time - Math.round(Date.now() / 1000);
        return this.request(httpMethod, path, params, callback, refer);
      }.bind(this), refer);
    }

    if (path.indexOf('/auth') < 0 && typeof(this.consumerKey) !== 'string') {
      return callback('[OVH] No consumerKey defined');
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
      'X-Ovh-Application': this.appKey,
    };

    // Remove undefined values
    for (var k in params) {
      if (params.hasOwnProperty(k) && typeof(params[k]) === 'undefined') {
        delete params[k];
      }
    }

    if (typeof(params) === 'object' && Object.keys(params).length > 0) {
      if (httpMethod === 'PUT' || httpMethod === 'POST') {
        options.headers['Content-Length'] = JSON.stringify(params).length;
      }
      else {
        options.path += '?' + querystring.stringify(params);
      }
    }

    // Sign request
    if (path.indexOf('/auth') < 0) {
      options.headers['X-Ovh-Consumer'] = this.consumerKey;
      options.headers['X-Ovh-Timestamp'] =
        Math.round(Date.now() / 1000) + this.apiTimeDiff;
      options.headers['X-Ovh-Signature'] =
        this.signRequest(
          httpMethod, 'https://' + options.host + options.path,
          params, options.headers['X-Ovh-Timestamp']
        );
    }

    if (this.debug) {
      this.debug(
        '[OVH] API call:',
        options.method, options.path,
        (httpMethod === 'PUT' || httpMethod === 'POST' &&
         typeof(params) === 'object' && Object.keys(params).length > 0) ?
          JSON.stringify(params) : ''
        );

    }

    var req = https.request(options, function (res) {
      var body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        var response;

        try {
          response = JSON.parse(body);
          if (this.debug) {
            this.debug(
              '[OVH]',
              'API response to',
              options.method, options.path, ':',
              body
            );
          }

        } catch (e) {
          if (res.statusCode !== 200) {
            return callback('[OVH] HTTP code is : ' + res.statusCode, res.statusCode);
          }
          else {
            return callback('[OVH] Unable to parse JSON reponse');
          }
        }

        if (res.statusCode !== 200) {
          callback(res.statusCode, response.message);
        }
        else {
          // Return a proxy (for potential next request)
          if (typeof(refer) !== 'undefined') {
            this.proxyResponseREST(response, refer, callback);
          }
          else {
            callback(null, response);
          }
        }
      }.bind(this));
    }.bind(this));

    req.on('error', function (e) {
      callback(e.errno);
    });

    if (typeof(this.timeout) === 'number') {
      req.on('socket', function (socket) {
        socket.setTimeout(this.timeout);
        if (typeof(socket._events.timeout) === 'undefined') {
          socket.on('timeout', function () {
            req.abort();
          });
        }
      }.bind(this));
    }

    if (httpMethod === 'PUT' || httpMethod === 'POST' &&
        typeof(params) === 'object' && Object.keys(params).length > 0) {
      req.write(JSON.stringify(params));
    }

    req.end();
  };

  Ovh.prototype.signRequest = function (httpMethod, url, params, timestamp) {
    var s = [
      this.appSecret,
      this.consumerKey,
      httpMethod,
      url,
      (httpMethod === 'PUT' || httpMethod === 'POST') &&
        typeof(params) === 'object' &&
        Object.keys(params).length > 0 ? JSON.stringify(params) : '',
      timestamp
    ];

    return '$1$' + crypto.createHash('sha1').update(s.join('+')).digest('hex');
  };

  module.exports = function (params) {
    return new Ovh(params || {});
  };

}).call(this);
