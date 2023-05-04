const router = require('express').Router();
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');
const Show = require("../models/Show.model.js");
const User = require("../models/User.model.js");
const fileUploader = require('../config/cloudinary.config');

router.get('/shows', isLoggedIn, (req, res) => {
              Show.find()
                  .populate("owner")
                  .then(allShows => {
                    console.log("found shows:", allShows);
                    res.render('animes/shows.hbs', {shows: allShows});
                  })
                  .catch(error => {
                    console.log('Error while getting the animes from the DB: ', error);
                    next(error);
                  });
       });




router.post('/shows/watchList/:showId', isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  const { showId } = req.params;

  Show.findById(showId)
      .then(theShow => {
        if (!user.watchList.includes(theShow._id)) {
          User.findByIdAndUpdate(user._id,
            {
              $addToSet: {watchList: theShow._id}
            },
            {new: true})
            .then((updatedUser) => {
              console.log("updatedUser", updatedUser)
              res.redirect("/auth/users/profile");
            })
            .catch(error => next(error))
        } else {
          res.redirect("/auth/users/profile");
        }
      })
      .catch(error => next(error));

    
})

router.post('/shows/favorites/:showId', isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  const { showId } = req.params;

  Show.findById(showId)
      .then(theShow => {
        if (!user.favorites.includes(theShow._id)) {
          User.findByIdAndUpdate(user._id,
            {
              $addToSet: {favorites: theShow._id}
            },
            {new: true})
            .then((updatedUser) => {
              console.log("updatedUser", updatedUser)
              res.redirect("/auth/users/profile");
            })
            .catch(error => next(error))
        } else {
          res.redirect("/auth/users/profile");
        }
      })
      .catch(error => next(error));

    
})

router.post('/shows/watchList/:showId/remove', isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  const { showId } = req.params;
  Show.findById(showId)
      .then((foundShow) => {
        User.findByIdAndUpdate(user._id, {$pull: {watchList: foundShow.id}}, {new: true})     
            .then(() => console.log("lol"))
      })
      .then(() => res.redirect("/auth/users/profile"))
})

router.post('/shows/favorites/:showId/remove', isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  const { showId } = req.params;
  Show.findById(showId)
      .then((foundShow) => {
        User.findByIdAndUpdate(user._id, {$pull: {favorites: foundShow.id}}, {new: true})
            .then((updatedUser) => console.log("updatedUser:", updatedUser))
      })
      .then(() => res.redirect("/auth/users/profile"))
    
})


router.get('/:showId/edit', (req, res, next) => {
  const { showId } = req.params;
  let user = req.session.user;

  Show.findById(showId)
    .populate("owner")
    .then(showToEdit => {
      if(showToEdit.owner.username === user.username) {
        res.render('animes/anime-edit.hbs', { show: showToEdit });
        } else {
          res.redirect(`/animes/${showToEdit.id}`)
        }
    })
    .catch(error => next(error));
});

router.post('/:showId/edit', fileUploader.single('img'), (req, res, next) => {
  const { showId } = req.params;
  const { name, genre, rating ,synopsis} = req.body;
 
  Show.findById(showId)
      .then((foundShow) => {

        Show.findByIdAndUpdate(showId, { name, genre, rating ,synopsis, img: req.file?.path || foundShow.img }, { new: true })
        .then(updatedShow => res.redirect(`/animes/${updatedShow.id}`))
        .catch(error => next(error));

      })
      .catch(error => next(error));


});

router.post('/:showId/delete', (req, res, next) => {
  const { showId } = req.params;
  let user = req.session.user;

  Show.findById(showId)
      .populate("owner")
      .then((foundShow) => {
        console.log("user:", user)
        console.log("owner:", foundShow.owner)
        if(foundShow.owner.username === user.username) {
          Show.findByIdAndDelete(showId)
              .then((deletedShow) => {
                User.findByIdAndUpdate(user._id, {$pull: {watchList: deletedShow.id}}, {new: true})
                    .then((updatedUser) => console.log("user after pull:", updatedUser))
                User.findByIdAndUpdate(user._id, {$pull: {favorites: deletedShow.id}}, {new: true})
                    .then((updatedUser) => console.log("user after pull:", updatedUser))
              
                  })
              .then(() => {
                res.redirect('/animes/shows')
              })
              .catch(error => next(error));
          } else {
            res.redirect(`/animes/${foundShow.id}`);
          }
      })
      .catch(error => next(error));
  
});

router.get('/anime-entry', isLoggedIn, (req, res) => res.render('animes/anime-entry.hbs'));

router.post('/anime-entry', fileUploader.single('img'), (req, res, next) => {
    const { name, genre, rating ,synopsis} = req.body;
    console.log("req.body is:",  req.body, req.file.path)
    if (!name || !genre || !rating || !synopsis || !req.file.path) {
        res.render('animes/anime-entry.hbs', { errorMessage: 'All fields are mandatory. Please try again' });
        return;
      }

      Show.create({name, genre, rating, synopsis, img: req.file.path, owner: req.session.user})
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

  router.get('/:showId', (req, res, next) => {
    const { showId } = req.params;
    console.log("req.params:", req.params);
    Show.findById(showId)
    .populate("owner")
    .then(theShow => res.render('animes/anime-detail.hbs', theShow ))
    .catch(error => {
      console.log('Error while retrieving anime details: ', error);
      next(error);
    });
});






module.exports = router;