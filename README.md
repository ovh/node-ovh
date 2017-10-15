This is an es7 async/await designed rewrite of the official (callback designed) ovh node API.
The easiest way to use the [OVH.com](http://ovh.com) APIs in your [node.js](http://nodejs.org/) applications.


## Diff with official API
* drop unsane endpoint draft
* drop unsane proxy API
* drop unsane non es7 callback API
* use debug for traces
* drop API wrapper


[![NPM Version](https://img.shields.io/npm/v/ovh-es.svg?style=flat)](https://www.npmjs.org/package/ovh-es)
[![Build Status](https://img.shields.io/travis/131/node-ovh.svg?style=flat)](http://travis-ci.org/131/node-ovh)
[![Coverage Status](https://img.shields.io/coveralls/131/node-ovh.svg?style=flat)](https://coveralls.io/r/131/node-ovh?branch=master)

```js
// Create your first application tokens here: https://api.ovh.com/createToken/?GET=/me
var ovh = require('ovh-es')({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  consumerKey: process.env.CONSUMER_KEY
});

var me = await ovh.request('GET', '/me');
console.log(err || 'Welcome ' + me.firstname);
```


## Installation

The easiest way to get the latest stable release is to grab it from the [npm registry](https://npmjs.org/package/ovh-es).

```bash
$ npm install ovh-es
```

## Example Usage

### Login as a user

#### 1. Create an application

Depending the API you plan yo use, you need to create an application on the below
websites:

* [OVH Europe](https://eu.api.ovh.com/createApp/)
* [OVH North-America](https://ca.api.ovh.com/createApp/)
* [RunAbove](https://api.runabove.com/createApp/)
* [SoYouStart Europe](https://eu.api.soyoustart.com/createApp/)
* [SoYouStart North-America](https://ca.api.soyoustart.com/createApp/)
* [Kimsufi Europe](https://eu.api.kimsufi.com/createApp/)
* [Kimsufi North-America](https://ca.api.kimsufi.com/createApp/)

Once created, you will obtain an **application key (AK)** and an **application
secret (AS)**.

#### 2. Authorize your application to access to a customer account

To allow your application to access to a customer account using an OVH API,
you need a **consumer key (CK)**.

Here is a sample code you can use to allow your application to access to a
complete account.

Depending the API you want to use, you need to specify the below API endpoint:

* OVH Europe: ```ovh-eu``` (default)
* OVH North-America: ```ovh-ca```
* RunAbove: ```runabove-ca```
* SoYouStart Europe: ```soyoustart-eu```
* SoYouStart North-America: ```soyoustart-ca```
* Kimsufi Europe: ```kimsufi-eu```
* Kimsufi North-America: ```kimsufi-ca```

```js
var ovh = require('ovh')({
  endpoint: 'ovh-eu',
  appKey: 'YOUR_APP_KEY',
  appSecret: 'YOUR_APP_SECRET'
});

const credential = await ovh.request('POST', '/auth/credential', {
  'accessRules': [
    { 'method': 'GET', 'path': '/*'},
    { 'method': 'POST', 'path': '/*'},
    { 'method': 'PUT', 'path': '/*'},
    { 'method': 'DELETE', 'path': '/*'}
  ]
});
```

```bash
$ node credentials.js
{ validationUrl: 'https://api.ovh.com/auth/?credentialToken=XXX',
  consumerKey: 'CK',
  state: 'pendingValidation' }
```

This consumer key can be scoped with a **specific authorization**.
For example if your application will only send SMS:

```javascript
var credential = await  ovh.request('POST', '/auth/credential', {
  'accessRules': [
    { 'method': 'POST', 'path': '/sms/*/jobs'},
  ]
});
```

Once the consumer key will be authorized on the specified URL,
you'll be able to play with the API calls allowed by this key.

#### 3. Let's play!

You are now be able to play with the API. Look at the
[examples available online](http://ovh.github.io/node-ovh#examples).

You can browse the API schemas using the web consoles of the APIs:

* [OVH Europe](https://eu.api.ovh.com/console/)
* [OVH North-America](https://ca.api.ovh.com/console/)
* [RunAbove](https://api.runabove.com/console/)
* [SoYouStart Europe](https://eu.api.soyoustart.com/console/)
* [SoYouStart North-America](https://ca.api.soyoustart.com/console/)
* [Kimsufi Europe](https://eu.api.kimsufi.com/console/)
* [Kimsufi North-America](https://ca.api.kimsufi.com/console/)


## Full documentation and examples

The full documentation is available online: http://ovh.github.io/node-ovh.

## Hacking

### Get the sources

```bash
git clone https://github.com/131/node-ovh.git
cd node-ovh
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

### Run the tests

Tests are based on [mocha](http://visionmedia.github.io/mocha/).
This package includes unit and integration tests.

```
git clone https://github.com/131/node-ovh.git
cd node-ovh
npm install -d
npm test
```

Integration tests use the OVH /domain/zone API, the tokens can be created
[here](https://api.ovh.com/createToken/).

```
export APP_KEY=xxxxx
export APP_SECRET=yyyyy
export CONSUMER_KEY=zzzzz
export DOMAIN_ZONE_NAME=example.com
npm run-script test-integration
```

### Documentation

The documentation is based on [Github Pages](https://pages.github.com/) and is
available in the *gh-pages* branch.


## Supported APIs

### OVH Europe

- **Documentation**: https://eu.api.ovh.com/
- **Community support**: api-subscribe@ml.ovh.net
- **Console**: https://eu.api.ovh.com/console
- **Create application credentials**: https://eu.api.ovh.com/createApp/
- **Create script credentials** (all keys at once): https://eu.api.ovh.com/createToken/

### OVH North America

- **Documentation**: https://ca.api.ovh.com/
- **Community support**: api-subscribe@ml.ovh.net
- **Console**: https://ca.api.ovh.com/console
- **Create application credentials**: https://ca.api.ovh.com/createApp/
- **Create script credentials** (all keys at once): https://ca.api.ovh.com/createToken/

### Runabove

- **Console**: https://api.runabove.com/console/
- **Create application credentials**: https://api.runabove.com/createApp/


### SoYouStart Europe

- **Documentation**: https://eu.api.soyoustart.com/
- **Community support**: api-subscribe@ml.ovh.net
- **Console**: https://eu.api.soyoustart.com/console/
- **Create application credentials**: https://eu.api.soyoustart.com/createApp/
- **Create script credentials** (all keys at once): https://eu.api.soyoustart.com/createToken/

### SoYouStart North America

- **Documentation**: https://ca.api.soyoustart.com/
- **Community support**: api-subscribe@ml.ovh.net
- **Console**: https://ca.api.soyoustart.com/console/
- **Create application credentials**: https://ca.api.soyoustart.com/createApp/
- **Create script credentials** (all keys at once): https://ca.api.soyoustart.com/createToken/

### Kimsufi Europe

- **Documentation**: https://eu.api.kimsufi.com/
- **Community support**: api-subscribe@ml.ovh.net
- **Console**: https://eu.api.kimsufi.com/console/
- **Create application credentials**: https://eu.api.kimsufi.com/createApp/
- **Create script credentials** (all keys at once): https://eu.api.kimsufi.com/createToken/

### Kimsufi North America

- **Documentation**: https://ca.api.kimsufi.com/
- **Community support**: api-subscribe@ml.ovh.net
- **Console**: https://ca.api.kimsufi.com/console/
- **Create application credentials**: https://ca.api.kimsufi.com/createApp/
- **Create script credentials** (all keys at once): https://ca.api.kimsufi.com/createToken/

## Related links

- **Contribute**: https://github.com/ovh/node-ovh
- **Report bugs**: https://github.com/ovh/node-ovh/issues
- **Download**: http://npmjs.org/package/ovh
