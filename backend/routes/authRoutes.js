const express = require('express');

/* Import our records controllers */
const registerController = require('../controllers/authen/register');
const rootController = require('../controllers/authen/root');
const signinController = require('../controllers/authen/signin');
const signoutController = require('../controllers/authen/signout');

/* Calling Router from express.Router() method
router is a pluggable mini-Express app */
const router = express.Router();

/* Adding a Filter '/records' before all Express routes below
in rootDir/server.js */

/* Registering http://localhost:3001/register
=> Express Router POST request handler */
router.post('/register', registerController.handleRegister);

/* Registering http://localhost:3001/
=> Express Router GET request handler */
router.get('/', rootController.handleRoot);

/* Registering http://localhost:3001/signin
=> Express Router POST request handler */
router.post('/signin', signinController.handleSignin);

/* Registering http://localhost:3001/signout
=> Express Router POST request handler */
router.post('/signout', signoutController.handleSignout);

module.exports = router;

