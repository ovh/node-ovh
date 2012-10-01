//
// nodeunit tests for node-ovh
//

var ovh = require('../../node-ovh/ovh.js');

exports.calls = {
  'getAnonymousSession': function (test) {
    "use strict";

    test.expect(1);

    var Ows = ovh({
      sessionHandler: 'sessionHandler/r4',
      cloudInstance: 'cloud/public/instance/r3'
    });

    Ows.sessionHandler.getAnonymousSession.call({
      language : 'fr',
      secured : false
    }, function (success, reponse) {
      test.ok(success && reponse.session.id.match('^classic/anonymous-'), 'Except an anonymous session');
      test.done();
    });
  }
};

