.PHONY: build

build: 
	npm install ./src/

run:
	NODE_ENV=development MODULE_NAME=hello FUNCTION_HANDLER=execute node ./src/server.js