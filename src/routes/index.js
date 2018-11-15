const router = require('express').Router();
const passport = require('passport');
const publica = require('../models/publish');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs= require('fs');
const AWS= require('aws-sdk');
const imgID= require('shortid');

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

router.get('/profile', multipartMiddleware ,isAuthenticated, async(req, res, next) => {
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
AWS.config.update({
  accessKeyId: 'AKIAI2RWPPRJKUX7PX3Q', 
  secretAccessKey: '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', 
  region: 'us-west-2'
})
const s3= new AWS.S3();

router.post('/publicar/:author', async(req, res, next)=>{
  var tmp_path= req.files.file.path;  
  let image= fs.createReadStream(tmp_path);
  let imageName= req.files.file.name;
  var userID= req.params.author;
  var serverImg= userID+"/"+imgID.generate()+imageName;
  var imageUrl;

  var params={
    Key: serverImg,
    Body: image,
    Bucket: 'srjefers',
    ACL: 'public-read-write'
  }
  
  s3.upload(params, function(err,data){
    if(err){
      console.log(err)
    }else{
      console.log(data.Location);
    }
    
    imageUrl= data.Location;

  });

  const datos = Object.assign({}, req.body, req.params, imageUrl);
  const insert = new publica(datos);
  console.log(datos);
  await insert.save();
  res.redirect('/profile');
});


module.exports = router;
