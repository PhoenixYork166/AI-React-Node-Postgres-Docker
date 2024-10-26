const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./util/database');
const fetch = require('node-fetch');

const profile = require('./controllers/profile');

const puppeteer = require('puppeteer');
const webScrap = require('./controllers/webScrap');

const rootDir = require('./util/path');
require('dotenv').config({ path: `${rootDir}/.env`});

const { printDateTime } = require('./util/printDateTime');
// 2. Test PostgreSQL connection
const { testDbConnection } = require('./util/testDbConnection');
testDbConnection(db);

const app = express(); 

// Assuming .env file sets NODE_ENV as 'production' in production
const isProduction = process.env.NODE_ENV === 'production';

// Middleware 
// 1. Requests Logging
const logger = require('./middleware/requestLogger');

console.log(`\n\nprocess.env.POSTGRES_HOST:\n${process.env.POSTGRES_HOST}\n\nprocess.env.POSTGRES_USER:\n${process.env.POSTGRES_USERNAME}\n\nprocess.env.POSTGRES_PASSWORD:\n${process.env.POSTGRES_PASSWORD}\n\n\nprocess.env.POSTGRES_DB:\n${process.env.POSTGRES_DB}\n\n\nprocess.env.POSTGRES_PORT:\n${process.env.POSTGRES_PORT}\n\nprocess.env.NODE_ENV:\n${process.env.NODE_ENV}\n`);

// Express middleware
/* Local dev Middleware for CORS (Cross-Origin-Resource-Sharing) */
const corsOptions = {
    origin: isProduction ? 'https://ai-recognition-frontend.onrender.com' : 'http://localhost:3000',
    credentials: true, // to support session cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};
app.use(cors(corsOptions));
// const corsOptions = {
//     origin: process.env.NODE_ENV === 'production' ? 'https://ai-recognition-frontend.onrender.com' : 'http://localhost:3000',
//     credentials: true, // to support session cookies
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// };

app.use(bodyParser.json({ limit: '100mb' }));
app.use(cookieParser());

/* Session cookies */
app.use(session({
    secret: 'secret', // Secret key to sign the session ID cookie
    resave: false, // Do not force the session to be saved back to session store
    saveUninitialized: true, // Do not force an uninitialized session to be saved to the store
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        // secure: false, // Set to true in production if using HTTPS
        httpOnly: true, // Prevent client-side scripting attacks
        expires: true, // Session cookie will be removed when user closes browser
        maxAge: 900000 // Expires after 15 min
    } // Use `secure: true` if you are using https
}));

/* Handling User's 'signin' from React */
app.get('/api/get-user-data', (req, res) => {
    console.log(`\nSession: `, req.session);
    if (req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: `Not authenticated` });
    }
});

// Will need either app.use(express.json()) || app.use(bodyParser.json()) to parse json 
app.use(express.json()); 

// ** Express Middleware for Logging HTTP Requests **
app.use(logger);


/* importing Express routers */
const authRoutes = require('./routes/authRoutes');
const recordsRoutes = require('./routes/records');
const imageRoutes = require('./routes/images');

/* User's auth routes for rootDir/controllers/authen */
app.use(authRoutes);

/* User's records routes for rootDir/controllers/records */
app.use('/records', recordsRoutes);

/* Image routes for rootDir/controllers/image */
app.use(imageRoutes);

// create /profile/:id route
// grab via req..params props
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) } );

// For Users to download records to .pdf files to their devices
app.post('/save-html', async(req, res) => { webScrap.saveHtml(req, res, puppeteer) });

// app.listen(port, fn)
// fn will run right after listening to a port
const port = process.env.PORT || 3001;

// const DATABASE_URL = process.env.DATABASE_URL
app.listen(port, () => {
    printDateTime();

    console.log(`\nNode app is up & running on port: ${port}\n`);
})
