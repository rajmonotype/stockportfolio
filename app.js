const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const router = require('./router');
const port = process.env.PORT || 8080; // port number of app

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.createRouter(app);

// *****************************************************************
// start the server 
// *****************************************************************

app.listen(port);
console.log('Server runs at http://localhost:' + port);
