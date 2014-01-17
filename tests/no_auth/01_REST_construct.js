//
// tests for node-ovh
//

var ovh = require('../..'),
    assert = require('assert');

exports.REST_construct = {
  'Constructor with a REST without app key / secret': function () {
    "use strict";

    assert.throws(
      function () { ovh({}); },
      /\[OVH\] You should precise an application key \/ secret/
    );

    assert.throws(
      function () { ovh({ appKey: 'XXX' }); },
      /\[OVH\] You should precise an application key \/ secret/
    );

    assert.throws(
      function () { ovh({ appSecret: 'XXX' }); },
      /\[OVH\] You should precise an application key \/ secret/
    );
  },
  'Constructor with specified hosts or basepaths': function () {
    "use strict";

    var rest = ovh({
      appKey: 'XXX', appSecret: 'XXX',
      host: 'ca.ovh.com', port: 344, basePath: '/0.42'
    });

    assert.equal(rest.host, 'ca.ovh.com');
    assert.equal(rest.port, 344);
    assert.equal(rest.basePath, '/0.42');
  },
  'Call method without CK': function (done) {
    "use strict";

    var rest = ovh({ appKey: 'XXX', appSecret: 'XXX', apis: [] });
    rest.request('GET', '/me', function (err, message) {
      assert.equal(err, 401);
      done();
    });
  }
};

