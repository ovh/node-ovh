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

    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);
    rest.domains.call('GET', '/domains', function (success, domains) {
      assert.ok(success && domains.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET /domains - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);
    rest.domains.$get(function (success, domains) {
      assert.ok(success && domains.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET /domains/{domain}/resolutions - domains.call()': function (done) {
    "use strict";

    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);
    rest.domains.call('GET', '/domains/{domain}/resolutions', { domain: auth.domainServiceName }, function (success, resolutions) {
      assert.ok(success && resolutions.length > 0);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET /domains/{domain}/resolutions - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);
    rest.domains[auth.domainServiceName].resolutions.$get(function (success, resolutions) {
      assert.ok(success && resolutions.length > 0);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET & PUT /domains/{domain}/resolutions/{id} - domains.call()': function (done) {
    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);

    var params;
    rest.domains.call('GET', '/domains/{domain}/resolutions', { domain: auth.domainServiceName }, function (success, result) {
      if (!success || result.length === 0) {
        assert.ok(0);
        return done();
      }
      
      var remaining = result.length;
      for (var i = 0 ; i < result.length ; ++i) {
        params = { domain: auth.domainServiceName, id: result[i] };
        rest.domains.call('GET', '/domains/{domain}/resolutions/{id}', params, function (success, resolution) {
            if (!success) {
              assert.ok(success);
              return done();
            }

            resolution.domain = auth.domainServiceName;
            rest.domains.call('PUT', '/domains/{domain}/resolutions/{id}', resolution, function (success, result) {
              assert.ok(success);
              if (--remaining === 0) {
                done();
              }
            });
        });
      }
    });
  },
  '[AUTH_TEST_DOMAIN] GET & PUT /domains/{domain}/resolutions/{id} - [object].$get() / [object].$put()': function (done) {
    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);

    var params;
    rest.domains[auth.domainServiceName].resolutions.$get(function (success, resolutions) {
      if (!success) {
        assert.ok(success);
        return done();
      }

      var remaining = resolutions.length;
      for (var i = 0 ; i < resolutions.length ; ++i) {
        var resolution = resolutions[i];

        this[resolution].$get(function (success, resolution) {
          resolution.$put(function (success, result, message) {
            if (!success) {
              console.error('PUT Error', result, message);
            }

            assert.ok(success);
            if (--remaining === 0) {
              done();
            }
          });
        });
      }
    });
  },
  '[AUTH_TEST_DOMAIN] GET /domains/{domain} AND GET /domains/{domain}/resolutions - [object].$get() - Keep current path when using this?': function (done) {
    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);

    rest.domains[auth.domainServiceName].$get(function(success, domain) {
      // `domains` -> domains details
      assert.ok(success);
      assert.equal(domain.domain, auth.domainServiceName);

      this.resolutions.$get(function (success, resolutions) {
        // `resolutions` -> Resolutions
        assert.ok(success && resolutions.length > 0);
        done();
      });
    });
  },
  '[AUTH_TEST_DOMAIN] GET /domains/{domain}/resolutions - [object].$get() - Test with query string': function (done) {
    "use strict";

    var rest = ovh({ domains: { type: 'REST', path: '/domains' } }, apiKeys);
    rest.domains[auth.domainServiceName].resolutions.$get({ 'subDomain': 'www', 'fieldType': 'CNAME' }, function (success, resolutions) {
      assert.ok(success);
      assert.equal(resolutions.length, 1);
      done();
    });
  },
};