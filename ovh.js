//
// node-ovh
//
// @version 0.1.0
// @author Vincent Giersch <mail@vincent.sh>
//

var https = require('https'),
    querystring = require('querystring'),
    proxy = require('node-proxy'),
    handlerMaker = require("./handler-maker");

(function () {
  "use strict";

  function OVHWS(wsList, wsServer) {
    this.wsList = wsList;
    this.wsMetas = {};
    this.wsServer = wsServer;

    var handler = handlerMaker(this),
        _this = this;

    // Catch WS name get
    handler.get = function (target, name) {
      if (typeof _this[name] !== "undefined") {
        return _this[name];
      }

      if (_this.wsList[name] === undefined) {
        return undefined;
      }

      // Catch the WS methods calls
      var handler = handlerMaker();
      handler.ws = name;
      handler.get = function (target, name) {
        var ws = this.ws;
        return {
          call: function (params, callback) {
            return _this.call(ws, name, params, callback);
          }
        };
      };

      return proxy.create(handler);
    };

    return proxy.create(handler);
  }

  // Call a ws method
  OVHWS.prototype.call = function (ws, method, params, callback) {
    var options = {
      host: this.wsServer,
      port: 443,
      method: 'GET',
      path: '/' + this.wsList[ws] + '/rest.dispatcher/' + method + '?' + querystring.stringify({ params: JSON.stringify(params) })
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
          try {
            var response = JSON.parse(body);

            if (response.error) {
              callback(false, response.error);
            }
            else {
              callback(true, response.answer);
            }
          } catch (e) {
            callback(false, 'Unable to parse JSON reponse');
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
        host: _this.wsServer,
        port: 443,
        method: 'GET',
        path: '/' + _this.wsList[k] + '/schema.json'
      };

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
            if (wsMeta.servicesInformations.prefix !== k) {
              callback(k, false, 'Your WS prefix should be ' + wsMeta.servicesInformations.prefix + ' instead of ' + k);
            }
            else {
              callback(k, true);
            }
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

  module.exports = function (wsList, wsServer) {
    wsServer = wsServer || 'ws.ovh.com';

    return new OVHWS(wsList, wsServer);
  };

}).call(this);
