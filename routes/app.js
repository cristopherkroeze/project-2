const { Router } = require('express');
const router = new Router();
const mongoose = require('mongoose');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

const index = require('/index');
app.use('/', index);
 
const authRouter = require('auth.routes');
app.use('/', authRouter);

const animeRoutes = require('./routes/anime.routes');
app.use('/', animeRoutes);

const app = express();
require('./config/session.config')(app);

module.exports = router;