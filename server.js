// Server.js

const express = require('express');           // Commonjs standard
const exphbs = require('express-handlebars');
const app = express();                        // Routing 
const port = 3000;

app.use(express.static('style'));             // For css

app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs.engine());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/collection', (req, res) => {
  res.render('views/collection');
})

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});