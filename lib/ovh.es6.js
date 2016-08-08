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

let https = require('https'),
  Bluebird = require('bluebird'),
  querystring = require('querystring'),
  url = require('url'),
  crypto = require('crypto'),
  async = require('async'),
  handlerMaker = require('./handler-maker'),
  endpoints = require('./endpoints');

class Ovh {
  constructor(params) {
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

      for (let key in endpoints[this.endpoint]) {
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
    if (this.debug && typeof(this.debug) !== 'function') {
      this.debug = console.log;
    }

    this.apis = { _path: '' };
    this.apisLoaded = !this.usedApi.length;

    if (typeof(this.appKey) !== 'string' ||
        typeof(this.appSecret) !== 'string') {
      throw new Error('[OVH] You should precise an application key / secret');
    }
  }

  /**
   * Recursively loads the schemas of the specified used APIs.
   *
   * @param {String} path
   * @param {Function} callback
   */
  loadSchemas(path, callback) {
    let request = {
      host: this.host,
      port: this.port,
      path: this.basePath + path
    };

    // Fetch only selected APIs
    if (path === '/') {
      return async.each(this.usedApi, (apiName, callback) => {
          this.loadSchemas('/' + apiName + '.json', callback);
        }, callback);
    }

    // Fetch all APIs
    this.loadSchemasRequest(request, (err, schema) => {
      if (err) {
        return callback(err, path);
      }

      async.each(
        schema.apis, (api, callback) => {
          let apiPath = api.path.split('/');

          this.addApi(apiPath, api, this.apis);
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
  addApi(apiPath, api, apis) {
    let path = apiPath.shift();
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
  loadSchemasRequest(options, callback) {
    https.get(options, (res) => {
      let body = '';

      res.on('data', (chunk) => body += chunk)
      .on('end', function () {
        try {
          body = JSON.parse(body);
        } catch (e) {
          if (res.statusCode !== 200) {
            return callback(
                '[OVH] Unable to load schema ' + options.path +
                ', HTTP response code: ' + res.statusCode, res.statusCode);
          }
          else {
            return callback('[OVH] Unable to parse the schema: ' + options.path);
          }
        }

        return callback(null, body);
      });
    })
    .on('error', /* istanbul ignore next */ (err) => callback('[OVH] Unable to fetch the schemas: ' + err));
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
  warnsRequest(httpMethod, pathStr) {
    let path = pathStr.split('/'),
      api = this.apis;

    while (path.length > 0) {
      let pElem = path.shift();
      if (pElem === '') {
        continue;
      }

      if (api[pElem] != null) {
        api = api[pElem];
        continue;
      }

      let keys = Object.keys(api);
      for (let i = 0 ; i < keys.length ; ++i) {
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

    if (!api._api || !api._api.operations) {
      return this.warn(
        '[OVH] Your call ' + pathStr + ' was not found in the API schemas.'
      );
    }

    for (let i = 0 ; i < api._api.operations.length ; ++i) {
      if (api._api.operations[i].httpMethod === httpMethod) {
        if (api._api.operations[i].apiStatus.value === 'DEPRECATED') {
          let status = api._api.operations[i].apiStatus;
          return this.warn(
            '[OVH] Your API call ' + pathStr + ' is tagged DEPRECATED since ' +
            status.deprecatedDate +
            ' and will deleted on ' + status.deletionDate,
            '. You can replace it with ' + status.replacement
          );
        }

        if (typeof(this.consumerKey) !== 'string' &&
            !api._api.operations[i].noAuthentication) {
          return this.warn(
            '[OVH] The API call ' + pathStr + ' requires an authentication' +
            ' with a consumer key.'
          );
        }

        return true;
      }
    }

    return this.warn(
      '[OVH] The method ' + httpMethod + ' for the API call ' +
      pathStr + ' was not found in the API schemas.'
    );
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
  request(httpMethod, path, params, callback, refer) {
    if (callback == null) {
      callback = params;
    }

    // Schemas
    if (!this.apisLoaded) {
      return this.loadSchemas('/', (err) => {
        if (err) {
          return callback(err);
        }

        this.apisLoaded = true;
        return this.request(httpMethod, path, params, callback, refer);
      });
    }

    // Time drift
    if (this.apiTimeDiff === null && path !== '/auth/time') {
      return this.request('GET', '/auth/time', {}, (err, time) => {
        if (err) {
          return callback('[OVH] Unable to fetch OVH API time');
        }

        this.apiTimeDiff = time - Math.round(Date.now() / 1000);
        return this.request(httpMethod, path, params, callback, refer);
      }, refer);
    }

    // Potential warnings
    if (Object.keys(this.apis).length > 1) {
      this.warnsRequest(httpMethod, path);
    }

    // Replace "{str}", used for $call()
    if (path.indexOf('{') >= 0) {
      let newPath = path;

      for (let paramKey in params) {
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

    let options = {
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
    for (let k in params) {
      if (params.hasOwnProperty(k) && params[k] == null) {
        delete params[k];
      }
    }

    let reqBody = null;
    if (typeof(params) === 'object' && Object.keys(params).length > 0) {
      if (httpMethod === 'PUT' || httpMethod === 'POST') {
        // Escape unicode
        reqBody = JSON.stringify(params).replace(/[\u0080-\uFFFF]/g, (m) => {
          return '\\u' + ('0000' + m.charCodeAt(0).toString(16)).slice(-4);
        });
        options.headers['Content-Length'] = reqBody.length;
      }
      else {
        options.path += '?' + querystring.stringify(params);
      }
    }

    if (path.indexOf('/auth') < 0) {
      options.headers['X-Ovh-Timestamp'] = Math.round(Date.now() / 1000) + this.apiTimeDiff;

      // Sign request
      if (typeof(this.consumerKey) === 'string') {
        options.headers['X-Ovh-Consumer'] = this.consumerKey;
        options.headers['X-Ovh-Signature'] = this.signRequest(
          httpMethod, 'https://' + options.host + options.path,
          reqBody, options.headers['X-Ovh-Timestamp']
        );
      }
    }

    if (this.debug) {
      this.debug(
        '[OVH] API call:',
        options.method, options.path,
        reqBody || ''
      );
    }

    let req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => body += chunk);

      res.on('end', () => {
        let response;

        if (body.length > 0) {
          try {
            response = JSON.parse(body);
          }
          catch (e) {
            return callback('[OVH] Unable to parse JSON reponse');
          }
        }
        else {
          response = null;
        }

        if (this.debug) {
          this.debug(
            '[OVH] API response to',
            options.method, options.path, ':',
            body
          );
        }

        if (res.statusCode !== 200) {
          callback(res.statusCode, response ? response.message : response);
        }
        else {
          // Return a proxy (for potential next request)
          if (refer != null) {
            this.proxyResponseREST(response, refer, callback);
          }
          else {
            callback(null, response);
          }
        }
      });
    });

    // istanbul ignore next
    req.on('error', (e) => callback(e.errno || e));

    // istanbul ignore next
    // mocked socket has no setTimeout
    if (typeof(this.timeout) === 'number') {
      req.on('socket', (socket) => {
        socket.setTimeout(this.timeout);
        if (socket._events.timeout != null) {
          socket.on('timeout', () => req.abort());
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
  requestPromised(httpMethod, path, params) {
    return new Bluebird((resolve, reject) => {
      return this.request(httpMethod, path, params, (error, resp) => {
        if (error) {
          return reject({error, message: resp});
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
  signRequest(httpMethod, url, body, timestamp) {
    let s = [
      this.appSecret,
      this.consumerKey,
      httpMethod,
      url,
      body || '',
      timestamp
    ];

    return '$1$' + crypto.createHash('sha1').update(s.join('+')).digest('hex');
  }

}

module.exports = function (params) {
  return new Ovh(params || {});
};