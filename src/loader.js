"use strict";

const path = require("path");

/**
 * Loads and returns the function module.
 * 
 * @param {string} moduleName The name of the function module.
 * @param {string} functionHandler The name of the function handler method.
 */
function loadFunctionModule(moduleName, functionHandler) {
	let module = null;

	let moduleRootPath = "/openbrisk/";
	if(process.env.NODE_ENV === "development") {
		// Load the function from the exaamples folder in development.
		moduleRootPath = "../examples/";
	}
	const modulePath = path.join(moduleRootPath, `${moduleName}.js`);

	console.log(`Loading module: ${modulePath}`);

	try {
		module = require(modulePath);
	}
	catch (ex) {
		console.error(`Function module not found: ${moduleName}, failed to require module:\n ${ex.message}`);
		process.exit(1);
	}

	console.log(`Loaded module: ${moduleName}.${functionHandler}`);
	return module;
}

module.exports = {
	loadFunctionModule
};