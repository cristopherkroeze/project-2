// bin/seeds.js

const mongoose = require('mongoose');
const Show = require('../models/Show.model');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/Animes';

const shows = [

    {
        name: "Death Note",
        genre: "Horror",
        rating: 10,
        synopsis: "MC finds notebook that kills people"
        //img: "" 
    }

];

mongoose
  .connect(MONGO_URI)
  .then(x => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);

    // Create new documents in the books collection
    return Show.create(shows);
  })
  .then(showsFromDB => {
    console.log(`Created ${showsFromDB.length} shows`);

    // Once the documents are created, close the DB connection
    return mongoose.connection.close();
  })
  .then(() => {
    // Once the DB connection is closed, print a message
    console.log('DB connection closed!');
  })
  .catch(err => {
    console.log(`An error occurred while creating shows from the DB: ${err}`);
  });
