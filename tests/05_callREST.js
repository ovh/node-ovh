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
    consumerKey: auth.consumerKey,
    credentialToken: auth.credentialToken
  };
} catch (err) {
  console.warn('The tests require ./auth to contain a JSON string with');
  console.warn('`consumerKey`, `credentialToken`, and `vpsServiceName`.');
  console.warn('Some tests (with AUTH_TEST mention) will be ignored.');
}

exports.callREST = {
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
  },
  '[AUTH_TEST] GET /vps - vps.call()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps.call('GET', '/vps', function (success, vps) {
      assert.ok(success && vps.length >= 1);
      done();
    });
  },
  '[AUTH_TEST] GET /vps - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps.$get(function (success, vps) {
      assert.ok(success && vps.length >= 1);
      done();
    });
  },
  '[AUTH_TEST] GET /vps/{domain}/ip - vps.call()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps.call('GET', '/vps/{domain}/ips', { domain: auth.vpsServiceName }, function (success, ips) {
      // At least one ipv4 and one ipv6
      assert.ok(success && ips.length >= 2);
      done();
    });
  },
  '[AUTH_TEST] GET /vps/{domain}/ip - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps[auth.vpsServiceName].ips.$get(function (success, ips) {
      // At least one ipv4 and one ipv6
      assert.ok(success && ips.length >= 2);
      done();
    });
  },
  '[AUTH_TEST] GET & POST /vps/{domain}/ip/{ipAddress} - vps.call()': function (done) {
    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);

    var params;
    rest.vps.call('GET', '/vps/{domain}/ips', { domain: auth.vpsServiceName }, function (success, result) {
      if (!success) {
        assert.ok(success);
        return done();
      }
      
      var remaining = 0;
      for (var i = 0 ; i < result.length ; ++i) {
        // Test only on ipv4
        if (result[i].match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) !== null) {
          remaining++;

          // Fetch informations about IP
          params = { domain: auth.vpsServiceName, ipAddress: result[i] };
          rest.vps.call('GET', '/vps/{domain}/ips/{ipAddress}', params, function (success, ip) {
              if (!success) {
                assert.ok(success);
                return done();
              }

              // Try to set reverse
              params = { domain: auth.vpsServiceName, ipAddress: ip.ipAddress, reverse: ip.reverse };
              rest.vps.call('PUT', '/vps/{domain}/ips/{ipAddress}', params, function (success, result) {
                assert.ok(success);

                if (--remaining === 0) {
                  done();
                }
              });
          });
        }
      }  
    });
  },
  '[AUTH_TEST] GET & POST /vps/{domain}/ip/{ipAddress} - [object].$get() / [object].$post()': function (done) {
    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);

    var params;
    rest.vps[auth.vpsServiceName].ips.$get(function (success, ips) {
      if (!success) {
        assert.ok(success);
        return done();
      }

      var remaining = 0;
      for (var i = 0 ; i < ips.length ; ++i) {
        var ip = ips[i];

        // Test only on ipv4
        if (ip.match(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/) !== null) {
          remaining++;

          this[ip].$get(function (success, ipDetails) {
            ipDetails.reverse = auth.vpsServiceName;
            ipDetails.$put(function (success, result, message) {
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
      }
    });
  },
  '[AUTH_TEST] GET /vps/{domain} AND GET /vps/{domain}/ips - [object].$get() - Keep current path when using this?': function (done) {
    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);

    rest.vps[auth.vpsServiceName].$get(function(success, vps) {
      // `vps` -> VPS details
      assert.ok(success);
      assert.equal(vps.name, auth.vpsServiceName);

      this.ips.$get(function (success, ips) {
        // `ips` -> IPs
        assert.ok(success && ips.length >= 2);
        done();
      });
    });
  }
};

