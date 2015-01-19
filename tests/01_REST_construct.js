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

exports.REST_construct = {
  'Constructor with a REST without app key / secret': function () {
    "use strict";

    assert.throws(
      function () { ovh(); },
      /\[OVH\] You should precise an application key \/ secret/
    );

    assert.throws(
      function () { ovh({}); },
      /\[OVH\] You should precise an application key \/ secret/
    );

    assert.throws(
      function () { ovh({ appKey: 'XXX' }); },
      /\[OVH\] You should precise an application key \/ secret/
    );

    assert.throws(
      function () { ovh({ appSecret: 'XXX' }); },
      /\[OVH\] You should precise an application key \/ secret/
    );
  },
  'Constructor with specified hosts or basepaths': function () {
    "use strict";

    var rest = ovh({
      appKey: 'XXX', appSecret: 'XXX',
      host: 'ca.ovh.com', port: 344, basePath: '/0.42'
    });

    assert.equal(rest.host, 'ca.ovh.com');
    assert.equal(rest.port, 344);
    assert.equal(rest.basePath, '/0.42');
  },
  'Call method without CK': function (done) {
    "use strict";

    nock('https://eu.api.ovh.com')
      .intercept('/1.0/auth/time', 'GET')
        .reply(200, Math.round(Date.now() / 1000))
      .intercept('/1.0/me', 'GET')
        .reply(401, {'message': 'You must login first'});

    var rest = ovh({ appKey: 'XXX', appSecret: 'XXX', apis: [] });
    rest.request('GET', '/me', function (err, message) {
      assert.equal(err, 401);
      assert.equal(message, 'You must login first');
      done();
    });
  },
  'Preconfigured API endpoints': function () {
    "use strict";

    var rest = ovh({
      appKey: 'XXX', appSecret: 'XXX',
      endpoint: 'sys-ca'
    });

    assert.equal(rest.host, 'ca.api.soyoustart.com');
    assert.equal(rest.port, 443);
    assert.equal(rest.basePath, '/1.0');

    rest = ovh({
      appKey: 'XXX', appSecret: 'XXX',
      endpoint: 'soyoustart-ca'
    });

    assert.equal(rest.host, 'ca.api.soyoustart.com');
    assert.equal(rest.port, 443);
    assert.equal(rest.basePath, '/1.0');

    assert.throws(
      function () { ovh({ appKey: 'XXX', appSecret: 'XXX', endpoint: 'eu-ovh' }); },
      /\[OVH\] Unknown API eu-ovh/
    );
  }
};
