/**
 * Copyright (c) 2014 OVH SAS
 * Copyright (c) 2012 - 2013 Vincent Giersch
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Except as contained in this notice, the name of OVH and or its trademarks
 * shall not be used in advertising or otherwise to promote the sale, use or
 * other dealings in this Software without prior written authorization from OVH.
 */

var ovh = require('..'),
    fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    nock = require('nock');

// To create an application:
// https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi
var APP_KEY = '42',
    APP_SECRET = '43';

// Fixtures
var fixtures_path = path.join(__dirname, 'fixtures');
var auth_path = path.join(fixtures_path, 'api.auth.json');
var auth_api = fs.readFileSync(auth_path).toString();
var bad_path = path.join(fixtures_path, 'api.bad.json');
var bad_api = fs.readFileSync(bad_path).toString();
var me_path = path.join(fixtures_path, 'api.me.json');
var me_api = fs.readFileSync(me_path).toString();
var deprecated_path = path.join(fixtures_path, 'api.deprecated.json');
var deprecated_api = fs.readFileSync(deprecated_path).toString();


exports.REST_check = {
  'Check Deprecated warning': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/deprecated/my-service/route', 'GET')
        .reply(200, 'Deprecated')
      .intercept('/1.0/deprecated.json', 'GET')
        .reply(200, deprecated_api)
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['deprecated'],
      warn: function (err) {
        assert.ok(err.indexOf('is tagged DEPRECATED') > 0);
        done();
      }
    });

    rest.request('GET', '/deprecated/my-service/route', function (err) {
      assert.ok(err);
    });
  },
  'Check Deprecated warning [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/deprecated/my-service/route', 'GET')
        .reply(200, 'Deprecated')
      .intercept('/1.0/deprecated.json', 'GET')
        .reply(200, deprecated_api)
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['deprecated'],
      warn: function (err) {
        assert.ok(err.indexOf('is tagged DEPRECATED') > 0);
        done();
      }
    });

    rest.requestPromised('GET', '/deprecated/my-service/route')
      .then(function (resp) {
        assert.ok(!resp);
      })
      .catch(function (err) {
        assert.ok(err);
      });
  },
  'Check call not found warning': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/auth/not-found', 'GET')
       .reply(404)
     .intercept('/1.0/auth.json', 'GET')
      .reply(200, auth_api);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['auth'],
      warn: function (err) {
        assert.equal(err, '[OVH] Your call /auth/not-found was not found in the API schemas.');
        done();
      }
    });

    rest.request('GET', '/auth/not-found', function (err) {
      assert.ok(err);
    });
  },
  'Check call not found warning [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/auth/not-found', 'GET')
       .reply(404)
     .intercept('/1.0/auth.json', 'GET')
      .reply(200, auth_api);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['auth'],
      warn: function (err) {
        assert.equal(err, '[OVH] Your call /auth/not-found was not found in the API schemas.');
        done();
      }
    });

    rest.requestPromised('GET', '/auth/not-found')
      .then(function (resp) {
        assert.ok(!resp);
       })
      .catch(function (err) {
        assert.ok(err);
      });
  },
  'Check api not found warning': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/auth', 'GET')
       .reply(404)
     .intercept('/1.0/auth.json', 'GET')
      .reply(200, bad_api);

    var warn = 0;
    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['auth'],
      warn: function (err) {
        assert.ok(err.indexOf('was not found in the API schemas.') > 0);
        if (++warn === 2) {
          done();
        }
      }
    });

    rest.request('GET', '/auth', function (err) {
      assert.ok(err);
    });
  },
  'Check api not found warning [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/auth', 'GET')
       .reply(404)
     .intercept('/1.0/auth.json', 'GET')
      .reply(200, bad_api);

    var warn = 0;
    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['auth'],
      warn: function (err) {
        assert.ok(err.indexOf('was not found in the API schemas.') > 0);
        if (++warn === 2) {
          done();
        }
      }
    });

    rest.requestPromised('GET', '/auth')
      .then(function (resp) {
        assert.ok(!resp);
      })
      .catch(function (err) {
        assert.ok(err);
      });
  },
  'Check HTTP method not found warning': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/me.json', 'GET')
        .reply(200, me_api)
      .intercept('/1.0/me', 'OVH')
        .reply(405);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
      warn: function (err) {
        assert.equal(err, '[OVH] The method OVH for the API call /me was not found in the API schemas.');
        done();
      }
    });

    rest.request('OVH', '/me', function (err) {
      assert.ok(err);
    });
  },
  'Check HTTP method not found warning [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/me.json', 'GET')
        .reply(200, me_api)
      .intercept('/1.0/me', 'OVH')
        .reply(405);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
      warn: function (err) {
        assert.equal(err, '[OVH] The method OVH for the API call /me was not found in the API schemas.');
        done();
      }
    });

    rest.requestPromised('OVH', '/me')
      .then(function (resp) {
        assert.ok(!resp);
      })
      .catch(function (err) {
        assert.ok(err);
      });
  },
  'Call method without CK': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/me.json', 'GET')
        .reply(200, me_api)
      .intercept('/1.0/me', 'GET')
        .reply(403);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
      warn: function (err) {
        assert.equal(err, '[OVH] The API call /me requires an authentication with a consumer key.');
        done();
      }
    });

    rest.request('GET', '/me', function (err) {
      assert.ok(err);
    });
  },
  'Call method without CK [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/me.json', 'GET')
        .reply(200, me_api)
      .intercept('/1.0/me', 'GET')
        .reply(403);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
      warn: function (err) {
        assert.equal(err, '[OVH] The API call /me requires an authentication with a consumer key.');
        done();
      }
    });

    rest.requestPromised('GET', '/me')
      .then(function (resp) {
        assert.ok(!resp);
      })
      .catch(function (err) {
        assert.ok(err);
      });
  },
  'Unable to load schema': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/meh.json', 'GET')
        .reply(404);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['meh'],
    });

    rest.request('GET', '/me', function (err) {
      assert.equal(err, '[OVH] Unable to load schema /1.0/meh.json, HTTP response code: 404');
      done();
    });
  },
  'Unable to load schema [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/meh.json', 'GET')
        .reply(404);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['meh'],
    });

    rest.requestPromised('GET', '/me')
      .then(function (resp) {
        assert.ok(!resp);
      })
      .catch(function (err) {
        assert.equal(err.error, '[OVH] Unable to load schema /1.0/meh.json, HTTP response code: 404');
      })
      .finally(done);
  },
  'Unable to parse schema': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/me.json', 'GET')
        .reply(200, '{"');

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
    });

    rest.request('GET', '/me', function (err) {
      assert.equal(err, '[OVH] Unable to parse the schema: /1.0/me.json');
      done();
    });
  },
  'Unable to parse schema [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api)
      .intercept('/1.0/me.json', 'GET')
        .reply(200, '{"');

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      apis: ['me'],
    });

    rest.requestPromised('GET', '/me')
      .then(function (resp) {
        assert.ok(!resp);
      })
      .catch(function (err) {
        assert.equal(err.error, '[OVH] Unable to parse the schema: /1.0/me.json');
      })
      .finally(done);
  },
  'Unable to fetch time': function (done) {
    'use strict';
    nock('https://ca.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(500)
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      endpoint: 'ovh-ca'
    });

    rest.request('GET', '/me', function (err) {
      assert.equal(err, '[OVH] Unable to fetch OVH API time');
      done();
    });
  },
  'Unable to fetch time [promised]': function (done) {
    'use strict';
    nock('https://ca.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(500)
      .intercept('/1.0/auth.json', 'GET')
        .reply(200, auth_api);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      endpoint: 'ovh-ca'
    });

    rest.requestPromised('GET', '/me')
      .then(function (resp) {
        assert.ok(!resp);
      })
      .catch(function (err) {
        assert.equal(err.error, '[OVH] Unable to fetch OVH API time');
      })
      .finally(done);
  }
};
