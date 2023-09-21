require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const unrestrictedRoutes = require('./src/api/v1/routes/unrestricted_routes');
const adminRoutes = require('./src/api/v1/routes/admin_routes');
const restrictedRoutes = require('./src/api/v1/routes/restricted_routes');

const app = express();


// GET PORT
const port = process.env.PORT;

if (!port) {
    throw new Error('port must be specified');
}

// CONNECT WITH DB AND GET ALLL MODELS
require('./src/config/db_config');

// CORS middleware
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/public/uploads', express.static('public/uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => res.send('The Server is running at port ' + port))

app.use('/api/v1/unrestricted', unrestrictedRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/restricted/user', restrictedRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));