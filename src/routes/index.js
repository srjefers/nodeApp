const router = require('express').Router();
const passport = require('passport');
const publica = require('../models/publish');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/profile',isAuthenticated, async(req, res, next) => {
  const posts = await publica.find();

  res.render('profile',{
    posts
  });
  
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}
// --------------------
router.post('/publicar/:author', async(req, res, next)=>{
  
  const datos = Object.assign({}, req.body, req.params);
  const insert = new publica(datos);
  console.log(datos);
  await insert.save();
  res.redirect('/profile');
});


module.exports = router;
