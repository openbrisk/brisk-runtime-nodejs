'use strict';

const path = require("path");

// TODO: Allow async and sync calls.
function loadFunctionModule(moduleName, functionHandler) {
    let moduleRootPath = "/openbrisk/";
    if(process.env.NODE_ENV === "development") {
        moduleRootPath = "../examples/";
    }
    const modulePath = path.join(moduleRootPath, `${moduleName}.js`);

    let module = null;

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