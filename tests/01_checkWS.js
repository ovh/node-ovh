//
// tests for node-ovh
//

var ovh = require('..'),
    assert = require('assert');

exports.checkWS = {
  'checkWS': function (done) {
    "use strict";

    // test.expect(3);

    var remaining = 3;
    var Ows = ovh({
      sessionHandler: 'sessionHandler/r4',
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
  },
  'checkWSBadPrefix': function (done) {
    "use strict";

    var Ows = ovh({
      adsl:           'xdsl/trunk'
    });

    Ows.checkWS(function (wsPrefix, success, errorMsg) {
      assert.ok(!success, 'Test WS ' + wsPrefix);
      done();
    });
  }
};
