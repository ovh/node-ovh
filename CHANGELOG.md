# Changelog

## 1.0.0

* WS are not supported anymore
* The usage of the Harmony proxies usage is optionnal
* Callbacks are designed "errors first"
* Optionnal check of the existance of a method in the APIs schemas and its status (PRODUCTION, DEPRECATED, etc.)
* Debug mode
* New documentation

## 0.3.8

* Fixes a potential EventEmitter memory leak when client uses a custom timeout value.

## 0.3.7

* Check time drift

## 0.3.6

* Fixes query string parameters.
* Fixes Proxy getter issue [096bff8].
* Remove exception in callREST.

## 0.3.5

* Ignore undefined parameters in REST API.
* Move VPS tests, add /domains tests.

## 0.3.4

* Add timeout option for REST API.

## 0.3.3

* Fixes requests signature.

## 0.3.2

* Tested with node v0.10.

## 0.3.1

* Fix for node v0.9.8.

## 0.3.0

* Major update, first version supporting OVH REST API (https://api.ovh.com).

## 0.2.0

* Using native harmony-proxies Node.js implementation with --harmony-proxies flag
* Moving from nodeunit to mocha
* Node.js v0.4 and v0.6 are not supported anymore

## 0.1.1

* Fix bad exception catch

## 0.1.0

* Initial release