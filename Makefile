all:		hint test
no_auth:	hint no_auth_test

hint:
	node_modules/.bin/jshint ovh.js
no_auth_test:
	node_modules/.bin/mocha --ui exports --reporter spec --slow 1000ms --timeout 5000ms --harmony-proxies tests/no_auth
	node_modules/.bin/mocha --ui exports --reporter spec --slow 1000ms --timeout 5000ms tests/no_auth -g Proxy -i
test:
	node_modules/.bin/mocha --ui exports --reporter spec --slow 1000ms --timeout 5000ms --harmony-proxies tests/*
	node_modules/.bin/mocha --ui exports --reporter spec --slow 1000ms --timeout 5000ms tests/* -g Proxy -i