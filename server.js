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

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/game_page', (req, res) => {
  res.render('game_page')
});

app.get('/collection', (req, res) => {
  res.render('collection', {title: 'heelo', message: 'world 123'});
});


app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});