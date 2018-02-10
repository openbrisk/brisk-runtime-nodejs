"use strict";

const express = require("express");
const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const loader = require("./loader");

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.text({ type : "text/plain" }));

// Load the function module and get the function to call.
const moduleName = process.env.MODULE_NAME;
const functionHandler = process.env.FUNCTION_HANDLER;
const functionModule = loader.loadFunctionModule(moduleName, functionHandler);
const func = functionModule[functionHandler];

// The timeout in seconds.
const timeout = process.env.FUNCTION_TIMEOUT || 10; // TODO: Define default timeout.

/**
 * The health check route.
 */
app.get("/healthz", (request, response) => {
	response.status(200).send("OK");
});

/**
 * Creates the context that is passed to the function and 
 * invokes the function of this server.
 * 
 * @param {*} request 
 * @param {*} response 
 */
const invokeFunction = (request, response) => {
	// NOTE: The context can be customized. See runtime specs for mandatory content.
	const briskContext = {
		data: request.body || {}
	};

	// Make sure that the function returns a promise.
	let funcPromise = Promise.resolve(func(briskContext));

	// Apply a timeout of <timeout> seconds to the function.
	let promise = timeoutPromise(timeout, funcPromise);

	// Wait for the promise to get resolved.
	promise.then(result => {
		if (typeof result === "string") {
			response.set("Content-Type", "text/plain");
		}
		else {
			response.set("Content-Type", "application/json");
		}
		response.status(200).send(result);
	});

	// Wait for the promise to get rejected or timed out.
	promise.catch(error => {
		console.error(`Error when executing function: ${error}`);
		response.status(500).send("Internal Function Error");
	});
};

/**
 * 
 * @param {*} seconds 
 * @param {*} reject 
 */
const timeoutPromise = function(seconds, promise) {
	// Create a promise that rejects after <seconds> seconds.
	let timeout = new Promise((resolve, reject) => {
		let id = setTimeout(() => {
			clearTimeout(id);
			reject(`Function timed out after ${seconds / 1000} seconds`);
		}, seconds * 1000);
	});

	// Returns a race between our timeout and the passed in promise.
	return Promise.race([
		promise,
		timeout
	]);
};

/**
 * Invoke the function with and without parameters.
 */
app.get("/", invokeFunction);
app.post("/", invokeFunction);

app.listen(8080, console.log("Listening on port 8080 ..."));
