const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/users");

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/demo', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*'); // in future allow only for CTS apps, by putting urls. video- 5 parsing the body @11:00
  res.header('Access-Control-Allow-Headers','*');// Origin,X-Requested-With,Content-Type,Accept,Authorization
  if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,PATCH');
      return res.status(200).json({});
  }
  next();
});
// add routes 
app.use("/api/user", userRoutes);

module.exports = app;
