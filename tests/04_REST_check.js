//
// tests for node-ovh
//

var ovh = require('..'),
    assert = require('assert');

exports.REST_check = {
  'checkREST': function (done) {
    "use strict";

    var remaining = 2;
    var Ows = ovh({
      auth: { type: 'REST', path: '/auth' },
      vps:  { type: 'REST', path: '/vps' }
    }, { appKey: 'X', appSecret: 'Y' });

    Ows.checkWS(function (wsPrefix, success, errorMsg) {
      assert.ok(success, 'Test WS ' + wsPrefix);

      if (--remaining === 0) {
        done();
      }
    });
  },
  'CheckRESTNonExistant': function (done) {
    "use strict";

    var Ows = ovh({
      telephony:  { type: 'REST', path: '/telephony' }
    }, { appKey: 'X', appSecret: 'Y' });

    Ows.checkWS(function (wsPrefix, success, errorMsg) {
      assert.ok(!success, 'Test WS ' + wsPrefix);
      done();
    });
  }
};
