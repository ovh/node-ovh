all:	hint test

hint:
	node_modules/.bin/jshint ovh.js tests
test:
	node_modules/.bin/nodeunit tests