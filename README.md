node-ovh
========

[![Build Status](https://secure.travis-ci.org/gierschv/node-ovh.png)](http://travis-ci.org/gierschv/node-ovh)

node-ovh is a Node.js helper library for OVH web services and OVH REST APIs.
The module usage is similar to the frontend lib OVHWS-Wrapper.
This module uses Node.js harmony proxies, so you have to use the `--harmony-proxies` flag while running node.

**This library is unofficial and consequently not maintained by OVH.**

Installation
------------

```javascript
$ npm install ovh
```

Examples
--------

### Using OVH WS

```javascript
var ovh = require('ovh');

// Instance a new OVH WS with used WS.
var Ows = ovh({
    sessionHandler: 'sessionHandler/r4',
    cloudInstance:  'cloud/public/instance/r3'
});

// Example of a WS Call (https://ws.ovh.com/sessionHandler/r4/documentation.html)
Ows.sessionHandler.getAnonymousSession.call({
    language : 'fr',
    secured : false
}, function (success, response) {
    console.log(!success || response.session.id);
});
```

### Using OVH REST API

#### Authentication
The authentication of the OVH REST API is similar to OAuth. You need the `appKey`
and the `appSecret` of [your application](https://www.ovh.com/fr/cgi-bin/api/createApplication.cgi).
In the unit tests, the `appKey` and `appSecret` are those of RICO, [the API documentation](https://api.ovh.com).

To use an API like *vps*, you need to allow your application to access to your OVH account.
To do that, you need to call the method `credential` of the API *auth*. For example, using this library:

```javascript
var ovh = require('ovh');

var rest = ovh({
  auth: { type: 'REST', path: '/auth' }
}, {
  appKey: 'YOUR_APP_KEY',
  appSecret: 'YOUR_APP_SECRET'
});

rest.auth.call('POST', '/auth/credential', {
  'accessRules': [
    { 'method': 'GET', 'path': '/*'},
    { 'method': 'POST', 'path': '/*'},
    { 'method': 'PUT', 'path': '/*'},
    { 'method': 'DELETE', 'path': '/*'}
  ]
}, function (success, credential) {
  console.log(credential);
});
```

Result:

```bash
$ node --harmony-proxies credential.js
{ validationUrl: 'https://www.ovh.com/fr/cgi-bin/api/requestCredential.cgi?credentialToken=AAAAAAAAAAAAAAAAAAAAAAAAAA',
  consumerKey: 'BBBBBBBBBBBBBBBBBBBBB',
  state: 'pendingValidation' }
```

To allow your application to use your account, you just need to go to the `validationUrl` and to authorize the application.
After that, you will be able to use this `credentialToken` and `consumerKey`. For more information, read the examples below.

#### Usage
You can call the REST API using differents ways. The first is similar to the WS usage:

```javascript
var ovh = require('ovh');

// Construct
var rest = ovh({
  vps:  { type: 'REST', path: '/vps' }
}, {
  appKey: 'X', appSecret: 'Y', consumerKey: 'B', credentialToken: 'A'
});

// Requesting "GET /vps"
rest.vps.call('GET', '/vps', function (success, vps) {
  console.log(!success || vps);
});

// Requesting "GET /vps/vpsXXXX.ovh.net/ips"
rest.vps.call('GET', '/vps/{domain}/ips', { domain: 'vpsXXXX.ovh.net' }, function (success, ips) {
  console.log(!success || ips);
});

// Requesting "PUT /vps/vpsXXXX.ovh.net/ips"
var params = { domain: 'vpsXXXX.ovh.net', ipAddress: '127.0.0.1', reverse: 'vpsXXXX.ovh.net' };
rest.vps.call('PUT', '/vps/{domain}/ips/{ipAddress}', params, function (success, httpErrorCode) {
  console.log(success || httpErrorCode);
});
```

The second way is designed to be faster to use:

```javascript
var ovh = require('ovh');

// Construct
var rest = ovh({
  vps:  { type: 'REST', path: '/vps' }
}, {
  appKey: 'X', appSecret: 'Y', consumerKey: 'B', credentialToken: 'A'
});

// Requesting "GET /vps"
rest.vps.get(function (success, vps) {
  console.log(!success || vps);
});

// Requesting "GET /vps/vpsXXXX.ovh.net/ips",
// "GET /vps/vpsXXXX.ovh.net/ips/{ip}" and "PUT /vps/vpsXXXX.ovh.net/ips/{ip}" for each IP
rest.vps['vpsXXXX.ovh.net'].ips.$get(function (success, ips) {
  for (var i = 0 ; i < ips.length ; ++i) {
    this[ips[i]].$get(function (success, ipDetails) {
      ipDetails.reverse = 'my-reverse.example.com';
      ipDetails.$put();
      // Or could be: ipDetails.$put({ reverse: 'my-reverse.example.com' });
    });
  }
});

```

More examples in *test* folder.

Changelog
---------

### 0.3.2

* Tested with node v0.10

### 0.3.1

* Fix for node v0.9.8

### 0.3.0

* Major update, first version supporting OVH REST API (https://api.ovh.com).

### 0.2.0

* Using native harmony-proxies Node.js implementation with --harmony-proxies flag
* Moving from nodeunit to mocha
* Node.js v0.4 and v0.6 are not supported anymore

### 0.1.1

* Fix bad exception catch

### 0.1.0

* Initial release

License
-------

node-ovh is freely distributable under the terms of the MIT license.

```
Copyright (c) 2012 - 2013 Vincent Giersch <mail@vincent.sh>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
