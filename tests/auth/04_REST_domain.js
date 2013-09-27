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

try {
  var auth = JSON.parse(fs.readFileSync('auth', 'ascii'));
  var apiKeys = {
    appKey: APP_KEY,
    appSecret: APP_SECRET,
    consumerKey: auth.consumerKey
  };
} catch (err) {
  console.warn('The tests require ./auth to contain a JSON string with');
  console.warn('`consumerKey`, and `domainServiceName`.');
  console.warn('Some tests (with AUTH_TEST_DOMAIN mention) will be ignored.');
}

exports.REST_domains = {
  '[AUTH_TEST_DOMAIN] GET /domains - domains.call()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.request('GET', '/domains', function (err, domains) {
      assert.ok(!err && domains.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domains - [object].$get()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.domains.$get(function (err, domains) {
      assert.ok(!err && domains.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET /domains/{domain}/resolutions - domains.call()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.request('GET', '/domains/{domain}/resolutions', { domain: auth.domainServiceName }, function (err, resolutions) {
      assert.ok(!err && resolutions.length > 0);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domains/{domain}/resolutions - [object].$get()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.domains[auth.domainServiceName].resolutions.$get(function (err, resolutions) {
      assert.ok(!err && resolutions.length > 0);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET & PUT /domains/{domain}/resolutions/{id} - domains.call()': function (done) {
    var rest = ovh(apiKeys);

    rest.request('GET', '/domains/{domain}/resolutions', { domain: auth.domainServiceName }, function (err, result) {
      if (err || result.length === 0) {
        assert.ok(!err);
        return done();
      }
      
      async.each(
        result,
        function (resId, callback) {
          async.waterfall([
            function (callback) {
              rest.request(
                'GET', '/domains/{domain}/resolutions/{id}',
                { domain: auth.domainServiceName, id: resId },
                callback
              );
            },
            function (resolution, callback) {
              resolution.domain = auth.domainServiceName;
              rest.request(
                'PUT', '/domains/{domain}/resolutions/{id}',
                resolution, callback
              );
            }
          ], callback);
        },
        function (err) {
          assert.ok(!err);
          done();
        }
      );
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET & PUT /domains/{domain}/resolutions/{id} - [object].$get() / [object].$put()': function (done) {
    var rest = ovh(apiKeys);

    rest.domains[auth.domainServiceName].resolutions.$get(function (err, resolutions) {
      if (err || resolutions.length === 0) {
        assert.ok(!err);
        return done();
      }

      async.each(
        resolutions,
        function (resId, callback) {
          async.waterfall([
            function (callback) {
              this[resId].$get(callback);
            }.bind(this),
            function (resolution, callback) {
              resolution.$put(callback);
            }
          ], callback);
        }.bind(this),
        function (err) {
          assert.ok(!err);
          done();
        }
      );
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domains/{domain} AND GET /domains/{domain}/resolutions - [object].$get() - Keep current path when using this?': function (done) {
    var rest = ovh(apiKeys);

    rest.domains[auth.domainServiceName].$get(function(err, domain) {
      // `domains` -> domains details
      assert.ok(!err);
      assert.equal(domain.domain, auth.domainServiceName);

      this.resolutions.$get(function (err, resolutions) {
        // `resolutions` -> Resolutions
        assert.ok(!err && resolutions.length > 0);
        done();
      });
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domains/{domain}/resolutions - [object].$get() - Test with query string': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.domains[auth.domainServiceName].resolutions.$get({ 'subDomain': 'www', 'fieldType': 'CNAME' }, function (err, resolutions) {
      assert.ok(!err);
      assert.equal(resolutions.length, 1);
      done();
    });
  },
};