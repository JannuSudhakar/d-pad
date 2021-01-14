const express = require('express');
const router = express.Router();
const preprocess = require('../utils/preprocess-dtd');
const {validCellTypes} = require('../utils/globals');
const { v4: uuidv4 } = require('uuid');
const assert = require('assert');

DTDFile = require('../models/dtd');

router.post('/create/*',async function(req,res){
  try{
    url = req.url.substr(8);
    dtd = await DTDFile.findOne({url:url});
    cellType = req.body.cellType;
    assert(validCellTypes.reduce(function(ret,elt){
      return ret || elt == cellType;
    },false));
    rowSet1 = Number(req.body.rowSet1);
    rowSet2 = Number(req.body.rowSet2);
    colSet1 = Number(req.body.colSet1);
    colSet2 = Number(req.body.colSet2);
    rowStart = Math.min(rowSet1,rowSet2);
    rowEnd = Math.max(rowSet1,rowSet2) + 1;
    colStart = Math.min(colSet1,colSet2);
    colEnd = Math.max(colSet1,colSet2) + 1;
    if(dtd.cells == null){
      dtd.cells = [];
    }
    dtd.cells.push({
      uid: uuidv4(),
      "cell-type": cellType,
      "content": "",
      "grid-column-start": colStart,
      "grid-column-end": colEnd,
      "grid-row-start": rowStart,
      "grid-row-end": rowEnd
    });
    await dtd.save();
    res.json({
      error: false
    })
  }
  catch(err){
    console.log(err);
    res.json({
      error: true
    });
  }
})

router.post('/reposition/*',async function(req,res){
  try{
    url = req.url.substr(12);
    rowSet1 = Number(req.body.rowSet1);
    rowSet2 = Number(req.body.rowSet2);
    colSet1 = Number(req.body.colSet1);
    colSet2 = Number(req.body.colSet2);
    rowStart = Math.min(rowSet1,rowSet2);
    rowEnd = Math.max(rowSet1,rowSet2) + 1;
    colStart = Math.min(colSet1,colSet2);
    colEnd = Math.max(colSet1,colSet2) + 1;
    dtd = await DTDFile.findOne({url:url});
    index = dtd.cells.findIndex(function(cell){
      return cell.uid == req.body.cellUID;
    })
    dtd.cells[index]["grid-column-start"] = colStart;
    dtd.cells[index]["grid-row-start"] = rowStart;
    dtd.cells[index]["grid-column-end"] = colEnd;
    dtd.cells[index]["grid-row-end"] = rowEnd;
    await dtd.save();
    res.json({
      error: false
    })
  }
  catch(err){
    console.log(err);
    res.json({
      error: true
    })
  }
})

router.post('/edit/*',async function(req,res){
  try{
    url = req.url.substr(6);
    dtd = await DTDFile.findOne({url:url});
    index = dtd.cells.findIndex(function(cell){
      return cell.uid == req.body.cellUID;
    })
    dtd.cells[index].content = req.body.content;
    await dtd.save();
    res.json({
      error: false
    })
  }
  catch(err){
    console.log(err);
    res.json({
      error: true
    })
  }
})

router.post('/remove/*',async function(req,res){
  try{
    url = req.url.substr(8);
    dtd = await DTDFile.findOne({url:url});
    index = dtd.cells.findIndex(function(cell){
      return cell.uid == req.body.cellUID;
    });
    dtd.cells.splice(index,1);
    await dtd.save();
    res.json({
      error: false
    })
  }
  catch(err){
    console.log(err);
    res.json({
      error: true
    })
  }
})

module.exports = router;
