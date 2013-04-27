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
  console.warn('`consumerKey`, and `vpsServiceName`.');
  console.warn('Some tests (with AUTH_TEST_VPS mention) will be ignored.');
}

exports.REST_vps = {
  '[AUTH_TEST_VPS] GET /vps - vps.call()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps.call('GET', '/vps', function (success, vps) {
      assert.ok(success && vps.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_VPS] GET /vps - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps.$get(function (success, vps) {
      assert.ok(success && vps.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_VPS] GET /vps/{serviceName}/ip - vps.call()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps.call('GET', '/vps/{serviceName}/ips', { serviceName: auth.vpsServiceName }, function (success, ips) {
      // At least one ipv4 and one ipv6
      assert.ok(success && ips.length >= 2);
      done();
    });
  },
  '[AUTH_TEST_VPS] GET /vps/{serviceName}/ip - [object].$get()': function (done) {
    "use strict";

    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);
    rest.vps[auth.vpsServiceName].ips.$get(function (success, ips) {
      // At least one ipv4 and one ipv6
      assert.ok(success && ips.length >= 2);
      done();
    });
  },
  '[AUTH_TEST_VPS] GET & POST /vps/{serviceName}/ip/{ipAddress} - vps.call()': function (done) {
    var rest = ovh({ vps: { type: 'REST', path: '/vps' } }, apiKeys);

    var params;
    rest.vps.call('GET', '/vps/{serviceName}/ips', { serviceName: auth.vpsServiceName }, function (success, result) {
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
          params = { serviceName: auth.vpsServiceName, ipAddress: result[i] };
          rest.vps.call('GET', '/vps/{serviceName}/ips/{ipAddress}', params, function (success, ip) {
              if (!success) {
                assert.ok(success);
                return done();
              }

              // Try to set reverse
              params = { serviceName: auth.vpsServiceName, ipAddress: ip.ipAddress, reverse: ip.reverse };
              rest.vps.call('PUT', '/vps/{serviceName}/ips/{ipAddress}', params, function (success, result) {
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
  '[AUTH_TEST_VPS] GET & POST /vps/{serviceName}/ip/{ipAddress} - [object].$get() / [object].$post()': function (done) {
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
  '[AUTH_TEST_VPS] GET /vps/{serviceName} AND GET /vps/{serviceName}/ips - [object].$get() - Keep current path when using this?': function (done) {
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