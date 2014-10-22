/**
 * Copyright (c) 2014 OVH SAS
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

var assert = require('assert'),
    async = require('async'),
    ovh = require('../..'),
    endpoints = require('../../lib/endpoints');

exports.REST_call = {
  'Preconfigured API endpoints: backends time': function (done) {
    "use strict";

    async.mapLimit(
      Object.keys(endpoints), Object.keys(endpoints).length,
      function (endpoint, callback) {
        endpoint = ovh({ appKey: 'X', appSecret: 'X', endpoint: endpoint });
        endpoint.request('GET', '/auth/time', callback);
      },
      function (err, times) {
        if (err) {
          return done(err);
        }

        for (var i = 0; i < times.length; i++) {
          assert(times[i] > Date.now() / 1000 - 3600);
        }

        done();
      }
    );
  }
};
