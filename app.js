// app.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const morgan = require('morgan')
const cors = require('cors')
//const cookieparser = require('cookie-parser')
const app = express();

//app.use(morgan('combined'))
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600, // Set the maximum age of the session cookie to 24 hours 86400000 (in milliseconds)
  }
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    return next();
  } else {
    res.redirect('/login');
  }
};

//  Prevent Back button after Logout 
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check for a predefined username and password (replace with a more secure method in production)
  if (username === 'geomanuk20@gmail.com' && password === '123456') {
    // Set session to mark the user as authenticated
    req.session.authenticated = true;
    res.redirect('/home');
  }else {
    res.send('Incorrect username or password. <a href="/login">Try again</a>');
  }
});

// Home page (accessible only if authenticated)
app.get('/home', authenticateUser, (req, res) => {
  res.render('home',{name: 'geo'});
});

// Logout route
app.post('/logout', (req, res) => {
  // Destroy the session to log the user out
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }else {
      //res.clearCookie('myCookie')
      res.redirect('/login');
    }
  });
});
app.get('/contact',(req,res)=>{
  res.render('contact');
});
app.post('/contact',(req,res)=>{
  res.redirect('contact')
})
app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/about',(req,res)=>{
  res.redirect('/about')
});

//calculate sum
app.get('/calculate-sum',(req,res) => {
  res.render('calculate-sum')
})
app.post('/calculate-sum',(req,res) => {
  res.redirect('/calculate-sum')
})
app.post('/calculate-sum', (req, res) => {
  const numbers = req.body.numbers;

  if (!numbers || !Array.isArray(numbers)) {
    return res.status(400).json({ error: 'Invalid input' });
}
const number= []
const sum = number.reduce((acc, num) => acc + num, 0);

  res.json({ sum });
});

// Client-side script to handle back-button
app.use((req, res, next) => {
  res.send(
    '<script>window.onload = function() { if (window.history.replaceState) { window.history.replaceState(null, null, window.location.href); } }</script>'
  );
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
