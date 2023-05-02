const router = require('express').Router();

router.get('/shows', (req, res) => {
              Show.find()
                  .then(allShows => {
                    res.render('animes/shows.hbs', {shows: allShows});
                  })
                  .catch(error => {
                    console.log('Error while getting the animes from the DB: ', error);
                    next(error);
                  });
       });

const Show = require('../models/Show.model.js');



router.post('/shows/watchList', (req, res, next) => {
  let user = req.session.user;
  const { showId } = req.params;

  Show.findById(showId)
      .then(theShow => {user.watchList.push(theShow)
        user.save()})
      .catch(error => next(error));

    res.redirect("/auth/users/profile");
})

router.post('/shows/favorites', (req, res, next) => {
  let user = req.session.user;
  const { showId } = req.params;

  Show.findById(showId)
      .then(theShow => {user.favorites.push(theShow)
      user.save()})
      .catch(error => next(error));
    res.redirect("/auth/users/profile");
})


router.get('/:showId/edit', (req, res, next) => {
  const { showId } = req.params;
 
  Show.findById(showId)
    .then(showToEdit => {
      res.render('/animes/anime-edit.hbs', { show: showToEdit });
    })
    .catch(error => next(error));
});

router.post('/:showId/edit', (req, res, next) => {
  const { showId } = req.params;
  const { name, genre, rating ,synopsis, img} = req.body;
 
  Show.findByIdAndUpdate(showId, { name, genre, rating ,synopsis, img }, { new: true })
    .then(updatedShow => res.redirect(`/animes/${updatedShow.id}`))
    .catch(error => next(error));
});

router.post('/:showId/delete', (req, res, next) => {
  const { showId } = req.params;
 
  Show.findByIdAndDelete(showId)
    .then(() => res.redirect('/animes/shows'))
    .catch(error => next(error));
});

router.get('/anime-entry', (req, res) => res.render('animes/anime-entry.hbs'));

router.post('/anime-entry', (req, res, next) => {
    const { name, genre, rating ,synopsis, img} = req.body;

    if (!name || !genre || !rating || !synopsis || !img) {
        res.render('/animes/anime-entry.hbs', { errorMessage: 'All fields are mandatory. Please try again' });
        return;
      }

      Show.create({name, genre, rating, synopsis, img})
            .then(res.redirect('/animes/shows'))
            .catch(error => next(error));
  });

router.get('/', (req, res, next) => {
    Show.find()
      .then(allShows => {
        res.render('animes/shows.hbs', {shows: allShows});
      })
      .catch(error => {
        console.log('Error while getting the animes from the DB: ', error);
           next(error);
      });
  });

  router.get('/:showId', (req, res) => {
    const { showId } = req.params;
    Show.findById(showId)
    .then(theShow => res.render('animes/anime-details.hbs', { show: theShow }))
    .catch(error => {
      console.log('Error while retrieving anime details: ', error);
      next(error);
    });
});






module.exports = router;