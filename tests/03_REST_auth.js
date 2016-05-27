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
    assert = require('assert'),
    nock = require('nock');

// To create an application:
// https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi
var APP_KEY = '42',
    APP_SECRET = '43';

exports.REST_call = {
  'GET /auth/time - ovh.request()': function (done) {
    "use strict";

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000));

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.request('GET', '/auth/time', {}, function (err, result) {
      assert.ok(!err && typeof(result) === 'number');
      done();
    });
  },
  'GET /auth/time [promised] - ovh.request()': function (done) {
    "use strict";

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000));

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.requestPromised('GET', '/auth/time', {})
      .then(function (result) {
        assert.ok(typeof(result) === 'number');
      })
      .catch(function (err) {
        assert.ok(!err);
      })
      .finally(done);
  },
  'GET /auth/credential - ovh.request()': function (done) {
    "use strict";

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/auth/credential', 'POST')
       .reply(200, {
         'validationUrl': 'http://eu.api.ovh.com',
         'consumerKey': '84',
         'state': 'pendingValidation'
       });

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.request('POST', '/auth/credential', {
      'accessRules': [
        { 'method': 'GET', 'path': '/*'},
        { 'method': 'POST', 'path': '/*'},
        { 'method': 'PUT', 'path': '/*'},
        { 'method': 'DELETE', 'path': '/*'}
      ],
      'redirection': 'https://npmjs.org/package/ovh'
    }, function (err, credential) {
      assert.ok(!err && credential.state === 'pendingValidation');
      done();
    });
  },
  'GET /auth/credential [promised] - ovh.request()': function (done) {
    "use strict";

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/auth/credential', 'POST')
       .reply(200, {
         'validationUrl': 'http://eu.api.ovh.com',
         'consumerKey': '84',
         'state': 'pendingValidation'
       });

    var rest = ovh({
      appKey: APP_KEY,
      appSecret: APP_SECRET
    });

    rest.requestPromised('POST', '/auth/credential', {
      'accessRules': [
        { 'method': 'GET', 'path': '/*'},
        { 'method': 'POST', 'path': '/*'},
        { 'method': 'PUT', 'path': '/*'},
        { 'method': 'DELETE', 'path': '/*'}
      ],
      'redirection': 'https://npmjs.org/package/ovh'
    })
    .then(function (credential) {
      assert.ok(credential && credential.state === 'pendingValidation');
    })
    .catch(function (err) {
      assert.ok(!err);
    })
    .finally(done);
  }
};

