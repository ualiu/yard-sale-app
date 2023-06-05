const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

//Static Folder
app.use(express.static("public"));

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
    })
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Failed to connect to MongoDb', error);
    process.exit(1);
  }
}

connectToMongoDB()

app.use('/api/post', require('./routes/post'));
app.use('/', require('./routes/auth'));

// Set up non-API routes
app.get('/', (req, res) => {
  res.render('landingPage/landingPage.ejs');
});

if (process.env.PORT) {
  app.listen(process.env.PORT)
}

module.exports = app
