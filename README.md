node-ovh
========

[![Build Status](https://secure.travis-ci.org/gierschv/node-ovh.png)](http://travis-ci.org/gierschv/node-ovh)

node-ovh is a Node.js helper library for OVH web services. The module usage is similar to the frontend lib OVHWS-Wrapper.

Installation
------------

    npm install ovh

Example
--------

    var ovh = require('ovh');

    // Instance a new OVH WS with used WS. Keys must be the WS prefixes
    var Ows = ovh({
        sessionHandler: 'sessionHandler/r4',
        cloudInstance:  'cloud/public/instance/r3'
    });

    // Example of a WS Call (https://ws.ovh.com/sessionHandler/r4/documentation.html)
    Ows.sessionHandler.getAnonymousSession.call({
        language : 'fr',
        secured : false
    }, function (success, reponse) {
        console.log(!success || reponse.session.id);
    });

Changelog
---------

### 0.1.0

Initial release

License
-------

node-ovh is freely distributable under the terms of the MIT license.

Copyright (c) 2012 Vincent Giersch

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.