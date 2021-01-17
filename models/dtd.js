const mongoose = require('mongoose');

const DTDSchema = mongoose.Schema({
  "created-by": {
    "name": String,
    "ip-address": String,
  },
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
      "last-edited-by": {
        "name": String,
        "ip-address": String,
      },
      uid: String,
      "grid-column-start": Number,
      "grid-row-start": Number,
      "grid-column-end": Number,
      "grid-row-end": Number,
      "cell-type": String,
      "inline-style": String,
      "content": String,
      "continuation-dtd": {
        "address-protocol": String,
        "address": String,
      }
    }
  ]
});

module.exports = mongoose.model('DTDFiles',DTDSchema);
