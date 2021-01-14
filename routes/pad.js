const express = require('express');
const router = express.Router();
const preprocess = require('../utils/preprocess-dtd');

DTDFile = require('../models/dtd');

router.get('/internal/*',async function(req,res){
  try{
    uid = req.url.substr(10);
    dtd = await DTDFile.findOne({"url":uid});
    res.render('pad',{
      errors: [],
      info: [],
      dtd: preprocess(dtd)
    });
  }
  catch(err){
    console.log(err);
    //req.flash('error','oops, something went wrong..');
    res.redirect('/');
  }
})

module.exports = router;
