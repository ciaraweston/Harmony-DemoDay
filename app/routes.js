module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  // app.get('/getinvolved', isLoggedIn, function (req, res) {
  //   db.collection('getinvolved').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('getinvolved.ejs', {
  //       user: req.user,
  //       messages: result
  //     })
  //   })
  // });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // GET INVOLVED ===============================================================
  // app.post('/messages', (req, res) => {
  //   db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/profile')
  //   })
  // }) // this is going to post and it is redirecting to the profile bc it's placing the information in that profile 

  // app.put('/upVote', (req, res) => {
  //   db.collection('messages')
  //     .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
  //       $set: {
  //         thumbUp: req.body.thumbUp + 1
  //       } // app.put is going to the messages route - it is going to the db in the collection called messages, it will then find update the properties and then it will send the information that is stored in result.
  //     }, {
  //       sort: { _id: -1 },
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  // })

  // app.put('/downVote', (req, res) => {
  //   db.collection('messages')
  //     .findOneAndUpdate({ name: req.body.name, msg: req.body.msg }, {
  //       $set: {
  //         thumbUp: req.body.thumbDown - 1
  //       } // app.put is going to the messages route - it is going to the db in the collection called messages, it will then find update the properties and then it will send the information that is stored in result.
  //     }, {
  //       sort: { _id: -1 },
  //       upsert: true
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  // })

  // app.delete('/messages', (req, res) => {
  //   db.collection('messages').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // }) // app.delete is going to the messages route - it is going to the db collection called messages, it will then find and delete the properties and it will send a message stating message deleted.

  // // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));



  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
