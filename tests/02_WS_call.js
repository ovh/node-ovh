//
// tests for node-ovh
//

var ovh = require('..'),
    assert = require('assert');

exports.WS_call = {
  'getAnonymousSession': function (done) {
    "use strict";

    var Ows = ovh({
      sessionHandler: 'sessionHandler/r4',
      cloudInstance: 'cloud/public/instance/r3'
    });

    Ows.sessionHandler.getAnonymousSession.call({
      language : 'fr',
      secured : false
    }, function (success, reponse) {
      assert.ok(success && reponse.session.id.match('^classic/anonymous-'), 'Except an anonymous session');
      done();
    });
  }
};

