//
// tests for node-ovh
//

var ovh = require('..'),
    assert = require('assert');

exports.constructREST = {
  'Constructor mix with WS and REST API': function () {
    "use strict";

    var Ows = ovh({
      sessionHandler: 'sessionHandler/r4',
      cloudInstance: { type: 'WS', path: '/cloud/public/instance/r3' },
      vps: { type: 'REST', path: '/vps' }
    }, { appKey: 'XXX', appSecret: 'YYY' });
  },
  'Constructor with unspecified type': function () {
    "use strict";

    assert.throws(
      function () { ovh({ cloudInstance: { path: '/cloud/public/instance/r3' } }); },
      /OVH: `type` is a compulsory parameter/
    );
  },
  'Constructor with unsupported type': function () {
    "use strict";

    assert.throws(
      function () { ovh({ telephony: { type: 'SOAPI', path: 'telephony' } }); },
      /OVH: types supported are \(WS|REST\)/
    );
  },
  'Constructor with unspecified path': function () {
    "use strict";

    assert.throws(
      function () { ovh({ vps: { type: 'REST' } }); },
      /OVH: `path` is a compulsory parameter/
    );
  },
  'Constructor with a REST without app key / secret': function () {
    "use strict";

    assert.throws(
      function () { ovh({ vps: { type: 'REST', path: '/vps' } }); },
      /OVH API: You should precise an application key \/ secret/
    );

    assert.throws(
      function () { ovh({ vps: { type: 'REST', path: '/vps' } }, { appKey: 'XXX' }); },
      /OVH API: You should precise an application key \/ secret/
    );

    assert.throws(
      function () { ovh({ vps: { type: 'REST', path: '/vps' } }, { appSecret: 'XXX' }); },
      /OVH API: You should precise an application key \/ secret/
    );
  },
  'Constructor with specified hosts or basepaths': function () {
    "use strict";

    var wsList = ovh({
      sessionHandler: { type: 'WS', path: '/sessionHandler/r4', host: 'ws.ovh.com' },
      cloudInstance: { type: 'WS', path: '/cloud/public/instance/r3', host: 'https://ws.ovh.com' },
      vps: { type: 'REST', path: '/vps' },
      vps_1: { type: 'REST', path: '/vps', host: 'https://api.ovh.com/0.42' },
      vps_2: { type: 'REST', path: '/vps', host: 'api.ovh.com', basePath: '/0.42' },
      vps_3: { type: 'REST', path: '/vps', host: 'https://api.ovh.ca/0.43', basePath: '/0.42' },
    }, { appKey: 'XXX', appSecret: 'YYY' }).wsList;

    assert.equal(wsList.vps.host, 'api.ovh.com');
    assert.equal(wsList.vps.basePath, '/1.0');
    assert.equal(wsList.vps_1.host, 'api.ovh.com');
    assert.equal(wsList.vps_1.basePath, '/0.42');
    assert.equal(wsList.vps_2.host, 'api.ovh.com');
    assert.equal(wsList.vps_2.basePath, '/0.42');
    assert.equal(wsList.vps_3.host, 'api.ovh.ca');
    assert.equal(wsList.vps_3.basePath, '/0.42');
  },
};

