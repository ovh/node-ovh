//
// tests for node-ovh
//

var fs = require('fs'),
    ovh = require('../..'),
    assert = require('assert');

// Use rico app credentials for unit tests
// To create an application: https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi
var APP_KEY = 'Pu8MQUKdCCSS5n0J',
    APP_SECRET = 'wC34J1zlMg0kvvZ05TGhpxSLT0JN2u48';

exports.REST_call = {
  'GET /auth/time - ovh.request()': function (done) {
    "use strict";

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.request('GET', '/auth/time', {}, function (err, result) {
      assert.ok(!err && typeof(result) === 'number');
      done();
    });
  },
  '[Proxy] GET /auth/time - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.auth.time.$get(function (err, result) {
      assert.ok(!err && typeof(result) === 'number');
      done();
    });
  },
  'GET /auth/credential - ovh.request()': function (done) {
    "use strict";

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.request('POST', '/auth/credential', {
      'accessRules': [
        { 'method': 'GET', 'path': '/*'},
        { 'method': 'POST', 'path': '/*'},
        { 'method': 'PUT', 'path': '/*'},
        { 'method': 'DELETE', 'path': '/*'}
      ],
      'redirection': 'https://npmjs.org/package/ovh'
    }, function (err, credential) {
      assert.ok(!err && credential.state === 'pendingValidation');
      done();
    });
  },
  '[Proxy] GET /auth/credential - [object].$post()': function (done) {
    "use strict";

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.auth.credential.$post({
      'accessRules': [
        { 'method': 'GET', 'path': '/*'},
        { 'method': 'POST', 'path': '/*'},
        { 'method': 'PUT', 'path': '/*'},
        { 'method': 'DELETE', 'path': '/*'}
      ],
      'redirection': 'https://npmjs.org/package/ovh'
    }, function (err, credential) {
      assert.ok(!err && credential.state === 'pendingValidation');
      done();
    });
  }
};

