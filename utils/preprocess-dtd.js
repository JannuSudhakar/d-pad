const {validCellTypes} = require('./globals');

function preprocess(dtd){
  style = `
  #board{
    grid-template-rows: repeat(${dtd['num-rows']},1fr);
    grid-template-columns: repeat(${dtd['num-columns']},1fr);
  }
  ${dtd['base-style']}
  `;
  cells = dtd.cells.map(function(cell){
    if(validCellTypes.reduce(function(ret,elt){
      return ret || elt == cell['cell-type'];
    },false)){
      if(cell['cell-type'] == "paragraph"){
        inlineStyle = `
        grid-column-start: ${cell["grid-column-start"]};
        grid-row-start: ${cell["grid-row-start"]};
        grid-column-end: ${cell["grid-column-end"]};
        grid-row-end: ${cell["grid-row-end"]};
        ${cell["inline-style"] || ""}
        `;
        return {
          uid: cell.uid,
          inlineStyle: inlineStyle,
          content: `<p id=edit-${cell.uid}>${cell.content.replace('\n','<br>')}</p>` //TODO IMPORTANT: implement escaping
        };
      }
    }
    else return {
      uid: cell.uid,
      inlineStyle: "",
      content: ""
    }
  });
  return {
    url: dtd.url,
    name: dtd.name,
    "num-rows": dtd["num-rows"],
    "num-columns": dtd["num-columns"],
    style: style,
    cells: cells
  }
}

module.exports = preprocess;
