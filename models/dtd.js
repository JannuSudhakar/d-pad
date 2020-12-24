const mongoose = require('mongoose');

const DTDSchema = mongoose.Schema({
  name: String,
  url: String,
  "num-rows": Number,
  "num-columns": Number,
  "preferred-stylesheet": String,
  "base-style": String,
  cells: [
    {
      "cell-type": String,
      "inline-style": String,
      "content": String,
      "hyperlink": String
    }
  ]
});

module.exports = mongoose.model('DTDFiles',DTDSchema);
