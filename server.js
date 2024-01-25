// Server.js

const express = require('express');             // Commonjs standard
const exphbs = require('express-handlebars');
const app = express();                          // Routing 
const port = 3000;

app.use(express.static('style'));               // For css

app.engine('handlebars', exphbs.engine(                  
  { extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/layouts/"
  }
));

app.set('view engine', 'handlebars');

/*
ROUTES
*/

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/game_page', (req, res) => {
  res.render('game_page')
});

app.get('/collection', (req, res) => {
  res.render('collection', {title: 'heelo', message: 'world 123'});
});

app.get('/current-deck-page/index', (req, res) => {
  res.render('index')
});

app.get('/game-generation-page/index', (req, res) => {
  res.render('index')
});

app.get('/look-at-games-page/index', (req, res) => {
  res.render('index')
});

app.get('/new-user-page/index', (req, res) => {
  res.render('index')
});

app.get('/reset-password-page/index', (req, res) => {
  res.render('index')
});

app.get('/user-profile-page/index', (req, res) => {
  res.render('index')
});

app.get('/welcome-page/index', (req, res) => {
  res.render('index')
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});