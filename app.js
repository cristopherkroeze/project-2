const express = require('express');
const bodyparser = require("body-parser");
const hbs = require('hbs');
const path = require('path');
let indexRoute = require("./routes/routes.js");
let authRoutes = require("./routes/auth.routes.js")
let animeRoutes = require("./routes/anime.routes.js")
const seeds = require("./bin/seeds.js")
const app = express();
require("dotenv").config()
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json({ type: 'application/json' }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session');
const MongoStore = require('connect-mongo');


    app.set('trust proxy', 1);
    app.enable('trust proxy');

    app.use(
        session({
          secret: process.env.SESS_SECRET,
          resave: true,
          saveUninitialized: false,
          cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 60000
          },
          store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || 'mongodb://0.0.0.0/project-2'
          })
        })
      );
   




app.use("/", indexRoute);
app.use("/auth", authRoutes)
app.use("/animes", animeRoutes)
// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + "/views/partials");
// ...

// Add the route handlers here:

app.listen(process.env.PORT, () => console.log('🏃 on port' + process.env.PORT));
