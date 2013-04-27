//
// tests for node-ovh
//

var fs = require('fs'),
    ovh = require('..'),
    assert = require('assert');

// Use rico app credentials for unit tests
// To create an application: https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi
var APP_KEY = 'Pu8MQUKdCCSS5n0J',
    APP_SECRET = 'wC34J1zlMg0kvvZ05TGhpxSLT0JN2u48';

exports.REST_call = {
  'GET /auth/time - auth.call()': function (done) {
    "use strict";

    var rest = ovh({
      auth: { type: 'REST', path: '/auth' }
    }, {
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.auth.call('GET', '/auth/time', {}, function (success, result) {
      assert.ok(success && typeof(result) === 'number');
      done();
    });
  },
  'GET /auth/time - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({
      auth: { type: 'REST', path: '/auth' }
    }, {
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.auth.time.$get(function (success, result) {
      assert.ok(success && typeof(result) === 'number');
      done();
    });
  },
  'GET /auth/credential - auth.call()': function (done) {
    "use strict";

    var rest = ovh({
      auth: { type: 'REST', path: '/auth' }
    }, {
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.auth.call('POST', '/auth/credential', {
      'accessRules': [
        { 'method': 'GET', 'path': '/*'},
        { 'method': 'POST', 'path': '/*'},
        { 'method': 'PUT', 'path': '/*'},
        { 'method': 'DELETE', 'path': '/*'}
      ],
      'redirection': 'https://npmjs.org/package/ovh'
    }, function (success, credential) {
      assert.ok(success && credential.state === 'pendingValidation');
      done();
    });
  },
  'GET /auth/credential - [object].$post()': function (done) {
    "use strict";

    var rest = ovh({
      auth: { type: 'REST', path: '/auth' }
    }, {
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
    }, function (success, credential) {
      assert.ok(success && credential.state === 'pendingValidation');
      done();
    });
  }
};

