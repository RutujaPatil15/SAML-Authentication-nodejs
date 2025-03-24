var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const fs = require('fs');
var session = require('express-session');
var passport = require('passport');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const SamlStrategy = require('passport-saml').Strategy;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    },
    (jwtPayload, done) => {
      const user = { id: jwtPayload.sub, email: jwtPayload.email };
      return done(null, user);
    }
  )
);

passport.use(new SamlStrategy(
  {
    path: process.env.SAML_PATH || '/login/callback',
    entryPoint: process.env.SAML_ENTRY_POINT || 'Paste your entrypoint here',
    issuer: 'passport-saml',
    cert: fs.readFileSync('samlssocert.pem', 'utf8')
  },
  function (profile, done) {
    // Generate an ID Token (JWT)
    const idToken = jwt.sign(
      {
        sub: profile.uid,
        email: profile.email,
        name: profile.cn,
        givenName: profile.givenName,
        familyName: profile.sn
      },
      'your-secret-key',
      { expiresIn: '1h', issuer: 'passport-saml' }
    );

    // Generate an Access Token (JWT)
    const accessToken = jwt.sign(
      {
        sub: profile.uid,
        roles: profile.roles || []
      },
      'your-secret-key',
      { expiresIn: '1h', issuer: 'passport-saml' }
    );
    return done(null,
      {
        id: profile.uid,
        email: profile.email,
        displayName: profile.cn,
        firstName: profile.givenName,
        lastName: profile.sn,
        idToken,
        accessToken
      });
  })
);

app.use(session(
  {
    name: 'refreshToken',
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    cookie: {
      maxAge: 60000,
      httpOnly: false,
      secure: false
    },
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// connect to client side
app.use(express.static(__dirname + '../../client/public/index.html'));


passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log("Deserialized user:", user);
  done(null, user);
});


app.get('/login',
  passport.authenticate('saml',
    {
      successRedirect: '/',
      failureRedirect: '/login'
    })
);

app.post('/login/callback',
  passport.authenticate('saml',
    {
      failureRedirect: '/',
      failureFlash: true
    }),
  function (req, res) {
    // const redirectUrl = `http://localhost:3000?user=${JSON.stringify(req.user)}`
    // res.redirect(redirectUrl);
    const idToken = req.user.idToken;
    res.cookie('idToken', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000
    });
    res.redirect('http://localhost:3000')
  }
);


app.get('/isuserloggedin', isValidUser, function (req, res, next) {
  return res.status(200).json(req.user);
});

app.get('/logout', isValidUser, function (req, res, next) {
  req.logout();
  return res.status(200).json({ message: 'Logout Success' });
});

function isValidUser(req, res, next) {
  if (req.isAuthenticated()) next();
  else return res.status(401).json({ message: 'Unauthorized Request' });
}

app.listen(8080);
console.log("server running on port 8080");