const express = require('express');

/* Import our records controllers */
const imageController = require('../controllers/image');

/* Calling Router from express.Router() method
router is a pluggable mini-Express app */
const router = express.Router();

/* Adding a Filter '/records' before all Express routes below
in rootDir/server.js */

/* Registering http://localhost:3001/image
=> Express Router POST request handler */
router.put('/image', imageController.handleImage);

/* Registering http://localhost:3001/celebrity-image
=> Express Router POST request handler */
router.post('/celebrity-image', imageController.handleCelebrityApi);

/* Registering http://localhost:3001/color-image
=> Express Router POST request handler */
router.post('/color-image', imageController.handleColorApi);

/* Registering http://localhost:3001/age-image
=> Express Router POST request handler */
router.post('/age-image', imageController.handleAgeApi);


module.exports = router;

