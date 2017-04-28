var express = require( 'express' );
var router=express.Router();
const passport = require('../authentication/passport')
db=require('../database/db')
var bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/', function(req, res, next) { // This function is called when receive request " GET / " 
      
  if(req.isAuthenticated()){   // If the request contains session of user information
       res.render('lobby', {auth_stat: 'Authenticated', email: req.user.email}); 
  } else {
       res.render('index', { title: 'UNO'});
  }
});



router.post('/signup', (req, res, next) => {
	
    bcrypt.hash(req.body.password, saltRounds).then( (hash) => {
    db.none('INSERT INTO users(email, encrypted_password, nick_name) VALUES($1, $2, $3)', [req.body.email, hash, req.body.nick_name])
    .then(() => {
		res.render('lobby', {auth_stat: 'Authenticated', email: req.body.email});
    })
    .catch(error => {
        // error; 
 		 console.log(error);
    });
    });
});


router.get('/signup', function(req, res, next) {
	res.render('signup_form', { title: 'Sign Up' });
});


router.post(
  '/login',
  passport.authenticate( 'local', { session: true,  
        successRedirect : '/lobby', // redirect to the lobby
        failureRedirect : '/', // redirect back to the index if error
        failureFlash : true // allow flash messages } ),
  })
);


router.get('/login', function(req, res, next) {
	
	if (req.isAuthenticated()){
	res.render('lobby', { auth_stat: 'Authenticated', email: req.user.email });
	} else {
	res.render('login_form', { title: 'Login' });
	}
});

router.get('/lobby', function(req, res, next) { // This function is called when receive request " GET /lobby " 
	if (req.isAuthenticated()){
	res.render('lobby', { auth_stat: 'Authenticated', email: req.user.email });
	} else {
	res.render('lobby', { auth_stat: 'Unauthenticated'});
	}
    
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
