const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const session = require('express-session');
//const passport = require('passport');
const dbconfig = require('./config/database');

mongoose.connect(dbconfig.database);
const db = mongoose.connection;

db.once('open',function(){
  console.log('Connected to MongoDB');
});

db.on('error',function(err){
  console.log(err);
});

const app = express();

app.use(express.static(__dirname+'/public'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

app.use(bodyParser.urlencoded({extended: false}));

// app.use(session({
//   secret: '2r3twf8odhisnc',
//   resave: false,
//   saveUninitialized: true
// }));

app.get('/',function(req,res){
    res.render('launcher',{existing_filelist:[
      {name:"file2", link:"/"},
      {name:"file3", link:"/"},
      {name:"file4", link:"/"},
      {name:"file5", link:"/"},
      {name:"file6", link:"/"},
      {name:"file7", link:"/"},
      {name:"file8", link:"/"}
    ]});
});

const port = process.env.PORT || 8000

app.listen(port,function(){
    console.log('Server started on port '+port);
})
