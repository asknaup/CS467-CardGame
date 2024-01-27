// Server.js

const express = require('express');             // Commonjs standard
const exphbs = require('express-handlebars');
const app = express();                          // Routing 
const port = 3000;

var db = require('./database/db-connector');

app.use(express.static('style'));               // For css

app.engine('handlebars', exphbs.engine(                  
  { extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts/"
  }
));

app.set('view engine', 'handlebars');
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
/*
ROUTES
*/

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/collection', (req, res) => {
  res.render('collection', {title: 'heelo', message: 'world 123'});
});

app.get('/current-deck-page/index', (req, res) => {
  res.render('current-deck-page/index')
});

app.get('/game-generation-page/index', (req, res) => {
  res.render('game-generation-page/index')
});

app.get('/look-at-games-page/index', (req, res) => {
  res.render('look-at-games-page/index')
});

app.get('/new-user-page/index', (req, res) => {
  res.render('new-user-page/index')
});

app.get('/reset-password-page/index', (req, res) => {
  res.render('reset-password-page/index')
});

app.get('/user-profile-page/index', (req, res) => {
  res.render('user-profile-page/index')
});

app.get('/welcome-page-portal/index', (req, res) => {
  res.render('welcome-page-portal/index')
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});