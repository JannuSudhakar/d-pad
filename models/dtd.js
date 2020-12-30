const mongoose = require('mongoose');

const DTDSchema = mongoose.Schema({
  name: String,
  url: String,
  "num-rows": Number,
  "num-columns": Number,
  "preferred-stylesheet": String,
  "base-style": String,
  "rack-details":{
    "rack-name": String,
    "parent-dtd-url": String,
    "continuation-dtd-url": String
  },
  cells: [
    {
      "cell-type": String,
      "inline-style": String,
      "content": String,
      "continuation-dtd": {
        "address-protocol": String;
        "address": String;
      }
    }
  ]
});

module.exports = mongoose.model('DTDFiles',DTDSchema);
