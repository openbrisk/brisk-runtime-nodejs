.PHONY: build

build: 
	docker build -t openbrisk/brisk-runtime-nodejs .

run:
	docker run -it \
	-p 8080:8080 \
	-e NODE_ENV=development \
	-e MODULE_NAME=hello_world \
	-e FUNCTION_HANDLER=execute \
	openbrisk/brisk-runtime-nodejs