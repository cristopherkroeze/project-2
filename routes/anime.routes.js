const router = require('express').Router();
router.get('/shows', (req, res) => res.render('animes/shows'));

const Show = require('../models/Show.model.js');




router.get('/animes/anime-entry', (req, res) => res.render('animes/anime-entry.hbs'));

router.post('/animes/anime-entry', (req, res, next) => {
    const { name, genre, rating ,synopsis, image} = req.body;

    if (!name || !genre || !rating || !synopsis || !image) {
        res.render('/animes/anime-entry', { errorMessage: 'All fields are mandatory. Please try again' });
        return;
      }

      Show.create({name, genre, rating, synopsis, image})
            .then(res.redirect('/anime/shows'))
            .catch(error => next(error));
  });

router.get('/animes', (req, res, next) => {
    Book.find()
      .then(allShows => {
        res.render('animes/shows.hbs', {shows: allShows});
      })
      .catch(error => {
        console.log('Error while getting the animes from the DB: ', error);
           next(error);
      });
  });

  router.get('/animes/:showId', (req, res) => {
    const { showId } = req.params;
    Show.findById(showId)
    .then(theShow => res.render('animes/anime-details.hbs', { show: theShow }))
    .catch(error => {
      console.log('Error while retrieving anime details: ', error);
      next(error);
    });
});






module.exports = router;