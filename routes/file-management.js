const express = require('express');
const multer = require('multer');
const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);

const router = express.Router();

const DTDFile = require('../models/dtd');
const {convertToString,convertFromString,checkUploadedFile} = require('../utils/file-conversion');

router.get("/download/*",async function(req,res){
  try{
    url = req.url;
    index = url.indexOf('=');
    url = url.substr(index+1);
    console.log(url);
    dtd = await DTDFile.findOne({url: url});
    stringified_dtd = await convertToString(dtd);
    res.send(stringified_dtd);
  }
  catch(err){
    console.log(err);
    res.json({
      error:true
    });
  }
})

router.post("/upload",async function(req,res){
  try{
    const storage = multer.diskStorage({
      destination: function(req,file,cb){
        cb(null,__dirname + '/../temp/');
      },
      filename: function(req,file,callback){
        callback(null, "temp");
      }
    });
    function fileFilter(req, file, callback){
      try{
        callback(null,checkUploadedFile(file));
      }
      catch(err){
        callback(err);
      }
    }
    let upload = util.promisify(multer({storage: storage, fileFilter: fileFilter}).single("upload-dtd"));
    await upload(req,res);
    const stringified_dtd = await readFile(req.file.path);
    const dtd = convertFromString(stringified_dtd);
    const newDTDFile = new DTDFile(dtd);
    await newDTDFile.save();
    res.redirect("/");
  }
  catch(err){
    console.log(err);
    res.send("error");
  }
})

module.exports = router;
