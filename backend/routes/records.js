const express = require('express');

/* Import our records controllers */
const celebrityRecordController = require('../controllers/records/celebrityRecords');
const colorRecordController = require('../controllers/records/colorRecords');
const ageRecordController = require('../controllers/records/ageRecords');

/* Calling Router from express.Router() method
router is a pluggable mini-Express app */
const router = express.Router();

/* Adding a Filter '/records' before all Express routes below
in rootDir/server.js */

/* Registering http://localhost:3001/records/save-user-celebrity
=> Express Router POST request handler */
router.post('/save-user-celebrity', celebrityRecordController.saveUserCelebrity);

/* Registering http://localhost:3001/records/get-user-celebrity
=> Express Router POST request handler */
router.post('/get-user-celebrity', celebrityRecordController.getUserCelebrity);

/* Registering http://localhost:3001/records/save-user-color
=> Express Router POST request handler */
router.post('/save-user-color', colorRecordController.saveUserColor);

/* Registering http://localhost:3001/records/get-user-color
=> Express Router POST request handler */
router.post('/get-user-color', colorRecordController.getUserColor);

/* Registering http://localhost:3001/records/save-user-age
=> Express Router POST request handler */
router.post('/save-user-age', ageRecordController.saveUserAgeRecords);

/* Registering http://localhost:3001/records/get-user-age
=> Express Router POST request handler */
router.post('/get-user-age', ageRecordController.getUserAgeRecords);

module.exports = router;

