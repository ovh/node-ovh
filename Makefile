#all:	hint test
all:	test

hint:
	node_modules/.bin/jshint ovh.js tests
test:
	node_modules/.bin/mocha --ui exports --reporter spec --slow 1000ms --timeout 5000ms --harmony-proxies tests