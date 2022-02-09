const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const session = require('express-session');
//const passport = require('passport');
const dbconfig = require('./config/database');
const { v4: uuidv4 } = require('uuid');

const {nouns,adjectives} = require('./utils/globals');
const {chooseRand} = require('./utils/misc-functions');

DTDFile = require('./models/dtd.js');

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

app.get('/',async function(req,res){
    const filelist = await DTDFile.find({},{name: 1, url: 1});
    //console.log(filelist);
    existing_filelist = filelist.map(function(dtd){
      return {name: dtd.name, link: "/pad/internal/"+dtd.url}
    });
    //console.log(existing_filelist)
    res.render('launcher',{baseurl:process.env.BASE_URL || '/', existing_filelist:existing_filelist});
});

app.post('/',function(req,res){
  res.json({error:false});
})
app.get('/new-file',function(req,res){
  const randName = chooseRand(adjectives) + " " + chooseRand(nouns);
  res.render('new-file',{baseurl:process.env.BASE_URL || '/', randName: randName});
})

app.post('/new-file',async function(req,res){
  try{
    const newFile = new DTDFile(await generateBaseTemplate(req.body,req));
    await newFile.save();
    res.redirect(`/pad/internal/${newFile.url}`);
  }
  catch(err){
    console.log(err);
    //req.flash("error","oops, something went wrong...");
    res.redirect('/new-file');
  }
})

app.use('/pad',require('./routes/pad'));
app.use('/edit',require('./routes/edit'));
app.use('/file-management',require('./routes/file-management'));

const port = process.env.PORT || 8000

app.listen(port,function(){
    console.log('Server started on port '+port);
})

//-------------will probably be refactored into a utils file------------------//

async function generateBaseTemplate(body,req){
  //TODO:  make sure that the filename doesn't clash.
  //TODO:  implement sanity checks for the fields.
  console.log(body["your-name"],req.connection.remoteAddress);
  return {
    "created-by":{
      name: body["your-name"],
      "ip-address": req.connection.remoteAddress
    },
    "name": body["name"],
    "url": uuidv4(),
    "num-rows": body["grid-rows"],
    "num-columns": body["grid-columns"],
    "preferred-stylesheet": "",
    "base-style":""
  }
}
