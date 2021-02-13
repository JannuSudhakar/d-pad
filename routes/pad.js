const express = require('express');
const router = express.Router();
const preprocess = require('../utils/preprocess-dtd');
const {renderPad} = require('../utils/render-pad');
const {english} = require('../utils/globals');

DTDFile = require('../models/dtd');

router.get('/internal/*',async function(req,res){
  try{
    uid = req.url.substr(10);
    dtd = await DTDFile.findOne({"url":uid});
    res.send(renderPad(preprocess(dtd),"/",english));
  }
  catch(err){
    console.log(err);
    //req.flash('error','oops, something went wrong..');
    res.redirect('/');
  }
})

module.exports = router;
