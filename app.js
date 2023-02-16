const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const db = require('./db/index');
const helper = require('./helpers');

const registerRouter = require('./routes/registration');
const loginRouter = require('./routes/login');

app.use('/register', registerRouter);
app.use('/login', loginRouter);

const PORT = process.env.PORT || 8000;

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  findById(id, function(err, user) {
    if(err) return done(err);
    done(null, user);
  })
}
  
);

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.users.findByUsername(username, (err, user) => {
      if(err) return done(err);
      if(!user) return done(null, false);
      if(user.password != password) return done(null, false);
      return done(null, user)
    });
  })
);

app.get('/', helper.findByUsername);

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.log('error')
      throw error
    }
    console.log(results.rows)
    res.status(200).json(results.rows)
  })
});

app.get('/profile', (req, res) => {
  res.render('Profile Page', { user: req.user });
}); 

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log('Server started successfully.');
})