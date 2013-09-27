//
// tests for node-ovh
//

var ovh = require('../..'),
    assert = require('assert');

// Use rico app credentials for unit tests
// To create an application: https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi
var APP_KEY = 'iE3vL3mgAtLZg00l',
    APP_SECRET = 'Gkmuh6Ce0SzxEAgexCA3zMkFGEWCwmqp';

exports.REST_check = {
  'Check Deprecated warning': function (done) {
    "use strict";
    
    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['sms'],
      warn: function (err) {
        assert.ok(err.indexOf('is tagged DEPRECATED') > 0);
        done();
      }
    });

    rest.request('GET', '/sms/42/histories', function (err) {
      assert.ok(err);
    });
  },
  'Check call not found warning': function (done) {
    "use strict";
    
    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
      warn: function (err) {
        assert.equal(err, '[OVH] Your call /me/not-found was not found in the API schemas.');
        done();
      }
    });

    rest.request('GET', '/me/not-found', function (err) {
      assert.ok(err);
    });
  },
  'Check HTTP method not found warning': function (done) {
    "use strict";
    
    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
      warn: function (err) {
        assert.equal(err, '[OVH] The method OVH for the API call /me was not found in the API schemas.');
        done();
      }
    });

    rest.request('OVH', '/me', function (err) {
      assert.ok(err);
    });
  }
};
