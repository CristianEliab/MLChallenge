const express = require("express");
const api = express.Router();

/**
 * Mutants functions
 */
const functions = require("../controllers/mutant");

/**
 * Routes
 */
api.post("/mutant", functions.checkMutant);
api.get("/stats", functions.getInfoStats);


module.exports = api;
