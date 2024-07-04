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

var ovh = require('../lib/ovh.es5'),
    assert = require('assert'),
    nock = require('nock');

var oauthConfig = {
  clientID: '1234',
  clientSecret: 'abcdef',
  endpoint: 'ovh-eu'
};

exports.REST_oauth2 = {
  'GET /me with a valid token': function (done) {
    'use strict';

    nock('https://www.ovh.com/auth')
     .intercept('/oauth2/token', 'POST')
       .reply(200, {
          'access_token': 'ok',
          'token_type': 'Bearer',
          'expires_in': 3599,
          'scope': 'all'
       });
    nock('https://eu.api.ovh.com', {
      reqheaders: {
        authorization: 'Bearer ok',
      },
    })
     .intercept('/1.0/me', 'GET')
       .reply(200, {"status": "ok"});

    var rest = ovh(oauthConfig);
    rest.request('GET', '/me', function (err, msg) {
      assert.ok(!err);
      assert.equal(msg.status, 'ok');
      done();
    });
  },
  'GET /me with a valid token [promised]': function (done) {
    'use strict';

    nock('https://www.ovh.com/auth')
     .intercept('/oauth2/token', 'POST')
       .reply(200, {
          'access_token': 'ok',
          'token_type': 'Bearer',
          'expires_in': 3599,
          'scope': 'all'
       });
    nock('https://eu.api.ovh.com', {
      reqheaders: {
        authorization: 'Bearer ok',
      },
    })
     .intercept('/1.0/me', 'GET')
       .reply(200, {"status": "ok"});

    var rest = ovh(oauthConfig);
    rest.requestPromised('GET', '/me')
      .then(function (msg) {
        assert.equal(msg.status, 'ok');
      })
      .catch(function (err) {
        assert.ok(!err);
      })
      .finally(done);
  },
  'GET /me with invalid credentials': function (done) {
    'use strict';

    nock('https://www.ovh.com/auth')
     .intercept('/oauth2/token', 'POST')
       .reply(401, {
          'error': 'Invalid client'
       });

    var rest = ovh(oauthConfig);
    rest.request('GET', '/me', function (err, msg) {
      assert.deepEqual(err, {
        statusCode: 401,
        error: 'Unauthorized',
        message: { 'error': 'Invalid client' }
      });
      done();
    });
  },
  'GET /me with expired token': function (done) {
    'use strict';

    this.timeout(5000);

    nock('https://www.ovh.com/auth')
     .intercept('/oauth2/token', 'POST')
     .reply(200, {
      'access_token': 'token1',
      'token_type': 'Bearer',
      'expires_in': 10,
      'scope': 'all'
      });
    nock('https://eu.api.ovh.com', {
      reqheaders: {
        authorization: 'Bearer token1',
      },
    }).intercept('/1.0/me', 'GET')
      .reply(200, {"status": "ok"});
    
    nock('https://www.ovh.com/auth')
      .intercept('/oauth2/token', 'POST')
      .reply(200, {
      'access_token': 'token2',
      'token_type': 'Bearer',
      'expires_in': 10,
      'scope': 'all'
    });
    nock('https://eu.api.ovh.com', {
      reqheaders: {
        authorization: 'Bearer token2',
      },
    })
    .intercept('/1.0/me', 'GET')
    .reply(200, {"status": "ok"});

    var rest = ovh(oauthConfig);
    rest.request('GET', '/me', function (err, msg) {
      assert.ok(!err);
      assert.equal(msg.status, 'ok');

      // Wait for first token expiration before resending a request
      setTimeout(function() {
        rest.request('GET', '/me', function (err, msg) {
          assert.ok(!err);
          assert.equal(msg.status, 'ok');
          done();
        });
      }, 2000);
    });
  },
};
