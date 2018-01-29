.PHONY: build

build: 
	docker run

run:
	NODE_ENV=development MODULE_NAME=hello FUNCTION_HANDLER=execute node ./src/server.js