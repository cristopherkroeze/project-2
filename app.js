const express = require('express');

const hbs = require('hbs');
const path = require('path');
var indexRouter = require("./config/index.js");

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
// Register the location for handlebars partials here:

hbs.registerPartials(__dirname + "/views/partials");
// ...

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
