require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const mognoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for front-end origin
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
}));

// Connect to database-------------------------------------------
mognoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, ((err) => {
  if (err) {
    console.log(`Error: ${err}`);
  } else {
    console.log('Connected to database');
  }
}));
// --------------------------------------------------------------

// Middleware ---------------------------------------------------

// Add body parser
app.use(express.json());

// Handle json parse errors
app.use((err, req, res, next) => {
  if (err) {
    return res.status(400).send('malformed request');
  }
  next();
});

// Add form data
bodyParser.urlencoded({
  extended: true
});
// ---------------------------------------------------------------

// Routes --------------------------------------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/archive', require('./routes/archive'));
app.use('/api/rejects', require('./routes/rejects'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/test', require('./routes/test'));

// ========= Route all other requests to Angular frontend in 'dist' folder ========
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
// ================================================================================

// ---------------------------------------------------------------

// Start listening
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
