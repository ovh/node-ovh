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
    ovh = require('../..'),
    assert = require('assert'),
    async = require('async');

// To create a test token
// https://eu.api.ovh.com/createToken/
if (!process.env.APP_KEY || !process.env.APP_SECRET ||
    !process.env.CONSUMER_KEY || !process.env.DOMAIN_ZONE_NAME) {
  console.warn('These tests require APP_KEY, APP_SECRET, CONSUMER_KEY and ');
  console.warn('DOMAIN_ZONE_NAME environment variables.');
}

var apiKeys = {
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  consumerKey: process.env.CONSUMER_KEY
};

exports.REST_domain = {
  '[AUTH_TEST_DOMAIN] GET /domain/zone - .request()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.request('GET', '/domain/zone', function (err, zones) {
      assert.ok(!err && zones.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domain/zone - [object].$get()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.domain.zone.$get(function (err, zones) {
      assert.ok(!err && zones.length >= 1);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET /domain/zone/{zoneName}/record - .request()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.request(
      'GET', '/domain/zone/{zoneName}/record',
      { zoneName: process.env.DOMAIN_ZONE_NAME },
      function (err, records) {
        assert.ok(!err && records.length > 0);
        done();
      }
    );
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domain/zone/{zoneName}/record - [object].$get()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.domain.zone[process.env.DOMAIN_ZONE_NAME].record.$get(function (err, records) {
      assert.ok(!err && records.length > 0);
      done();
    });
  },
  '[AUTH_TEST_DOMAIN] GET & PUT /domain/zone/{zoneName}/record - .request()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);

    rest.request(
      'GET', '/domain/zone/{zoneName}/record',
      { zoneName: process.env.DOMAIN_ZONE_NAME },
      function (err, result) {
        if (err || result.length === 0) {
          assert.ok(!err);
          return done();
        }

        async.each(
          result,
          function (recordId, callback) {
            async.waterfall([
              function (callback) {
                rest.request(
                  'GET', '/domain/zone/{zoneName}/record/{id}',
                  { zoneName: process.env.DOMAIN_ZONE_NAME, id: recordId },
                  callback
                );
              },
              function (record, callback) {
                // No modification, just PUT same complete record
                // zoneName is not provided in response
                record.zoneName = process.env.DOMAIN_ZONE_NAME;
                rest.request(
                  'PUT', '/domain/zone/{zoneName}/record/{id}',
                  record, callback
                );
              }
            ], callback);
          },
          function (err) {
            assert.ok(!err);
            done();
          }
        );
      }
    );
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET & PUT /domain/zone/{zoneName}/record - [object].$get() / [object].$put()': function (done) {
    "use strict";

    var rest = ovh(apiKeys);

    rest.domain.zone[process.env.DOMAIN_ZONE_NAME].record.$get(function (err, records) {
      if (err || records.length === 0) {
        assert.ok(!err);
        return done();
      }

      async.each(
        records,
        function (recordId, callback) {
          async.waterfall([
            function (callback) {
              this[recordId].$get(callback);
            }.bind(this),
            function (record, callback) {
              record.$put(callback);
            }
          ], callback);
        }.bind(this),
        function (err) {
          assert.ok(!err);
          done();
        }
      );
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domain/zone/{zoneName} AND GET /domain/zone/{zoneName}/record - [object].$get() - Keep current path when using this?': function (done) {
    "use strict";
    var rest = ovh(apiKeys);

    rest.domain.zone[process.env.DOMAIN_ZONE_NAME].$get(function(err, zone) {
      assert.ok(!err);
      assert.ok(!!zone.lastUpdate);

      this.record.$get(function (err, records) {
        assert.ok(!err && records.length > 0);
        done();
      });
    });
  },
  '[AUTH_TEST_DOMAIN][Proxy] GET /domain/zone/{zoneName}/record - [object].$get() - Test with query string': function (done) {
    "use strict";

    var rest = ovh(apiKeys);
    rest.domain.zone[process.env.DOMAIN_ZONE_NAME].record.$get(
      { 'subDomain': '', 'fieldType': 'NS' },
      function (err, records) {
        assert.ok(!err);
        assert.ok(records.length > 0);
        done();
      }
    );
  },
};
