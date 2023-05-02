// bin/seeds.js

const mongoose = require('mongoose');
const Show = require('../models/Show.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/Animes';



mongoose
  .connect(MONGO_URI)
  .then(x => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.log(`An error occurred while creating shows from the DB: ${err}`);
  });
