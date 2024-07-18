# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [3.0.0](https://github.com/ovh/node-ovh/compare/v2.0.3...v3.0.0) (2024-07-18)


### ⚠ BREAKING CHANGES

* package name is now @ovhcloud/node-ovh

Signed-off-by: Marie JONES <14836007+marie-j@users.noreply.github.com>

### build

* update release process ([efd8fcd](https://github.com/ovh/node-ovh/commit/efd8fcdd1607b92400bb1098996a413a35d7cdaa))


### Features

* add oauth2 authentication method ([880852b](https://github.com/ovh/node-ovh/commit/880852b48f402ef6f8ca9ebf575a92fc079beb67))
* allow /v1 or /v2 prefixes in path ([380d1ac](https://github.com/ovh/node-ovh/commit/380d1ac1a68654cbfb3450a01497c59bc4c0885d))

## 2.0.3

* [#19](https://github.com/ovh/node-ovh/pull/19) - docs(README): Update Mocha link
* [#34](https://github.com/ovh/node-ovh/pull/34) - docs(README): fix typo
* [#36](https://github.com/ovh/node-ovh/pull/36) - ci(travis): require Node.js 8
* [#35](https://github.com/ovh/node-ovh/pull/35) - docs(https): Fix Mixed Content Warnings
* [#37](https://github.com/ovh/node-ovh/pull/37) - fix(endpoint): remove non-reachable runabove endpoint

## 2.0.2

* [#15](https://github.com/ovh/node-ovh/pull/15) - fix(ovh): disable deletion of 0 or empty string params
* [#24](https://github.com/ovh/node-ovh/pull/24) - Add US API
* [#24](https://github.com/ovh/node-ovh/pull/24) - Remove comma to match every other api endpoint
* [#27](https://github.com/ovh/node-ovh/pull/27) - chore(travis): Drop support for node < 4 (Not maintained anymore)
* [#29](https://github.com/ovh/node-ovh/pull/29) - feat(api): change OVH US API endpoint
* chore(travis): drop support < 6 ([1656444](https://github.com/ovh/node-ovh/tree/1656444d0ff3d7485d11aa617b50bc5bb5bc279b))
* chore(es5): recompile ([1c68edb](https://github.com/ovh/node-ovh/tree/1c68edb7682d85719fd118ebff2ff4ce50e2c0f3))

## 2.0.1

* [#10](https://github.com/ovh/node-ovh/pull/10) - Upgrade node version, delete proxy support (deprecated), add promise support
* [#15](https://github.com/ovh/node-ovh/pull/15) - fix(ovh): disable deletion of 0 or empty string params

## 2.0.0

* Support of node v5 and v6
* Remove the proxy mode with harmonies
* Add requestPromised for promise support natively

## 1.1.3

* Support zero-byte JSON HTTP bodies (#2)

## 1.1.2

* Add aliases soyoustart-eu, soyoustart-ca, kimsufi-eu, kimsufi-ca to sys-eu, sys-ca, ks-eu and ks-ca.

## 1.1.1

* Add Kimsufi and SoYouStart APIs

## 1.1
* Now official Node.js wrapper
* Rewrite part of the tests, README & documentation
* Add CONTRIBUTING guidelines
* Add `endpoint` parameter with preconfigured API endpoints.
* Discontinue node.js <= 0.9 support

## 1.0.2

* Fix noAuthenticated calls
* Optionnal consumer key, now checked only on debug
* Fix unicode (thanks to @naholyr #4)

## 1.0.1

* Fix initial value for apiTimeDiff (gierschv/node-ovh#1)
* Include auth API for /auth/time if `usedApi` parameter is defined
* Fix duplicate call of warning function

## 1.0.0

* WS are not supported anymore
* The usage of the Harmony proxies usage is optional
* Callbacks are designed "errors first"
* Optional check of the existence of a method in the APIs schemas and its status (PRODUCTION, DEPRECATED, etc.)
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
