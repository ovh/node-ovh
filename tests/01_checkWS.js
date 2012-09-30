//
// nodeunit tests for node-ovh
//

var ovh = require('../../node-ovh/ovh.js');

exports.checkWS = {
    'checkWS': function (test) {
        "use strict";

        test.expect(3);

        var remaining = 3;
        var Ows = ovh({
            sessionHandler: 'sessionHandler/r4',
            cloudInstance:  'cloud/public/instance/r3',
            xdsl:           'xdsl/trunk'
        });

        Ows.checkWS(function (wsPrefix, success, errorMsg) {
            test.ok(success, 'Test WS ' + wsPrefix);

            if (--remaining === 0) {
                test.done();
            }
        });
    },
    'checkWSNonExistant': function (test) {
        "use strict";

        test.expect(1);

        var Ows = ovh({
            nonExistant:    'foo/bar/r0'
        });

        Ows.checkWS(function (wsPrefix, success, errorMsg) {
            test.ok(!success, 'Test WS ' + wsPrefix);
            test.done();
        });
    },
    'checkWSBadPrefix': function (test) {
        "use strict";

        test.expect(1);

        var Ows = ovh({
            adsl:           'xdsl/trunk'
        });

        Ows.checkWS(function (wsPrefix, success, errorMsg) {
            test.ok(!success, 'Test WS ' + wsPrefix);
            test.done();
        });
    }
};
