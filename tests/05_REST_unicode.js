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

var fs = require('fs'),
    ovh = require('..'),
    assert = require('assert'),
    async = require('async'),
    nock = require('nock');

var apiKeys = {
  appKey: '42',
  appSecret: '43',
  consumerKey: '44'
};

exports.REST_sms = {
  'POST /sms/{serviceName}/job': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/sms/foo/jobs', 'POST')
       .reply(200, function (uri, requestBody) {
         assert.equal(requestBody.message, "tèsté");
         return {};
       });

    var rest = ovh(apiKeys);
    rest.request('POST', '/sms/foo/jobs', {'message': 'tèsté'}, function (err, msg) {
      assert.ok(!err);
      done();
    });
  },
  'POST /sms/{serviceName}/job [promised]': function (done) {
    'use strict';

    nock('https://eu.api.ovh.com')
     .intercept('/1.0/auth/time', 'GET')
       .reply(200, Math.round(Date.now() / 1000))
     .intercept('/1.0/sms/foo/jobs', 'POST')
       .reply(200, function (uri, requestBody) {
         assert.equal(requestBody.message, "tèsté");
         return {};
       });

    var rest = ovh(apiKeys);
    rest.requestPromised('POST', '/sms/foo/jobs', {'message': 'tèsté'})
      .catch(function (err) {
        assert.ok(!err);
      })
      .finally(done);
  }
};
