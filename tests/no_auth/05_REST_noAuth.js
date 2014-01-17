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
  'POST /newAccount - test noAuthentication method': function (done) {
    "use strict";

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.request('POST', '/newAccount', {
      email: 'h@ovh.fr',
    }, function (err, result) {
      assert.ok(result.indexOf('Missing') > -1);
      done();
    });
  }
};

