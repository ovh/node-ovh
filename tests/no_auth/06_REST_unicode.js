//
// tests for node-ovh
//

var fs = require('fs'),
    ovh = require('../..'),
    assert = require('assert'),
    async = require('async');

// Use rico app credentials for unit tests
// To create an application: https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi
var APP_KEY = 'iE3vL3mgAtLZg00l',
    APP_SECRET = 'Gkmuh6Ce0SzxEAgexCA3zMkFGEWCwmqp';

var apiKeys = {
  appKey: APP_KEY,
  appSecret: APP_SECRET,
};

exports.REST_domains = {
  'POST /sms/{serviceName}/job': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.request('POST', '/sms/foo/jobs', {'message': 'tèsté'}, function (err, msg) {
      assert.equal(err, 401);
      done();
    });
  }
};