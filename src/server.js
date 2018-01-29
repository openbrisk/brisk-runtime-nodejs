"use strict";

const express = require("express");
const morgan = require("morgan");
const loader = require("./loader");

express.json();

const app = express();
app.use(morgan("combined"));

const moduleName = process.env.MODULE_NAME;
const functionHandler = process.env.FUNCTION_HANDLER;
const functionModule = loader.loadFunctionModule(moduleName, functionHandler);
const func = functionModule[functionHandler];

/**
 * The health check route.
 */
app.get("/healthz", (request, response) => {
    response.status(200).send("OK");
});

/**
 * Invoke the function without parameters.
 */
app.get("/runtime/v1/", (request, response) => {
    let result = func(request, response);

    if(typeof result === "string") {
        response.set("Content-Type", "text/plain");
    }
    else {
        response.set("Content-Type", "application/json");
    }

    response.send(result);
});

/**
 * Invoke the function with parameters.
 */
app.post("/runtime/v1/", (request, response) => {
    // TODO
});

app.listen(8080);