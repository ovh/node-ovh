//
// tests for node-ovh
//

var ovh = require('..'),
    assert = require('assert');

exports.WS_check = {
  'checkWS': function (done) {
    "use strict";

    var remaining = 4;
    var Ows = ovh({
      sessionHandlerEU: { type: 'WS', path: 'sessionHandler/r4' },
      sessionHandlerCA: { type: 'WS', path: 'sessionHandler/r4', host: 'ws.ovh.ca' },
      cloudInstance:  'cloud/public/instance/r3',
      xdsl:           'xdsl/trunk'
    });

    Ows.checkWS(function (wsPrefix, success, errorMsg) {
      assert.ok(success, 'Test WS ' + wsPrefix);

      if (--remaining === 0) {
        done();
      }
    });
  },
  'checkWSNonExistant': function (done) {
    "use strict";

    var Ows = ovh({
      nonExistant:    'foo/bar/r0'
    });

    Ows.checkWS(function (wsPrefix, success, errorMsg) {
      assert.ok(!success, 'Test WS ' + wsPrefix);
      done();
    });
  }
};
