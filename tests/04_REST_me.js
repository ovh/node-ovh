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
    async = require('async'),
    assert = require('assert'),
    nock = require('nock');

// To create an application:
// https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi
var APP_KEY = '42',
    APP_SECRET = '43',
    CONSUMER_KEY = '44';

exports.REST_me = {
  'PUT /me - ovh.request()': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/me', 'PUT')
       .reply(200, {
          'city': 'Roubaix Valley'
       });

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      consumerKey: CONSUMER_KEY
    });

    rest.request('PUT', '/me', {
      'city': 'Roubaix Valley'
    }, function (err) {
      assert.ok(!err);
      done();
    });
  },
  'PUT /me - ovh.request() - 403': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/me', 'PUT')
       .reply(403, {
         'errorCode': 'INVALID_CREDENTIAL',
         'httpCode': '403 Forbidden',
         'message': 'This credential is not valid'
       });

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      consumerKey: CONSUMER_KEY
    });

    rest.request('PUT', '/me', {
      'city': 'Roubaix Valley'
    }, function (statusCode, message) {
      assert.equal(statusCode, 403);
      assert.equal(message, 'This credential is not valid');
      done();
    });
  },
  'GET /me/aggreements/{id} - Variable replacement': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/me/agreements/42', 'GET')
       .reply(200, {});

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      consumerKey: CONSUMER_KEY
    });

    rest.request('GET', '/me/agreements/{id}', {
      'id': 42
    }, function (err) {
      assert.ok(!err);
      done();
    });
  },
  'GET /me/agreements - Filtering': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/me/agreement?agreed=ok', 'GET')
       .reply(200, [])
     .intercept('/1.0/me/agreement', 'GET')
       .reply(200, [42]);

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      consumerKey: CONSUMER_KEY,
      debug: function (message) {
        assert.ok(message);
      }
    });

    rest.request('GET', '/me/agreement', {
      'agreed': 'ok'
    }, function (err, agreements) {
      assert.ok(!err);
      assert.equal(agreements.length, 0);
      done();
    });
  },
  'PUT /me - Remove undefined': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/me', 'PUT')
       .reply(403, {
         'errorCode': 'INVALID_CREDENTIAL',
         'httpCode': '403 Forbidden',
         'message': 'This credential is not valid'
       });

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      consumerKey: CONSUMER_KEY
    });

    rest.request('PUT', '/me', {
      'city': 'Roubaix Valley',
      'firstname': undefined
    }, function (statusCode, message) {
      assert.equal(statusCode, 403);
      assert.equal(message, 'This credential is not valid');
      done();
    });
  },
  'DELETE /todelete - 0 bytes JSON body': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/todelete', 'DELETE')
       .reply(200, '');

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET,
      consumerKey: CONSUMER_KEY
    });

    rest.request('DELETE', '/todelete', function (err, message) {
      assert.ok(!err);
      assert.equal(message, null);
      done();
    });
  }
};

