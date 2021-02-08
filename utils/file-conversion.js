const { v4: uuidv4 } = require('uuid');

async function convertToString(dtd){
  if(dtd._id){
    delete dtd._id;
  }
  if(dtd.url){
    delete dtd.url;
  }
  return JSON.stringify(dtd);
}

function checkUploadedFile(file){
  return true;
}

function convertFromString(stringified_dtd){
  let dtd = JSON.parse(stringified_dtd);
  if(dtd._id){
    delete dtd._id;
  }
  if(dtd.url){
    delete dtd.url;
  }
  dtd.url = uuidv4();
  return dtd;
}

module.exports = {
  convertToString,
  convertFromString,
  checkUploadedFile
};
