function renderPad(dtd,js_path,errors,info){
  let cells = ""
  for(let i = 0; i < dtd.cells.length; i++){
    cell = dtd.cells[i];
    cells += `<div class=dtd-cell id=cell-${cell.uid} style="${cell.inlineStyle}" onclick="clickCell(this)" ondblclick="dblClickCell(this)">${cell.content}</div>\n`;
  }
  let tokenCells = ""
  for(var row = 1; row < dtd["num-rows"]+1; row++){
    for(var column = 1; column < dtd["num-columns"]+1; column++){
      tokenCells += `<div class=cell-marker onclick="setCellCorner(${row},${column})" id=row-${row}-col-${column} style="grid-row-start: ${row}; grid-column-start: ${column};"></div>\n`
    }
  }
  return `
<html>
  <head>
    <title>${dtd.name}</title>
    <link rel="stylesheet" type="text/css" href="/dtd-style1.css">
    <style>${dtd.style}</style>
    <style id="cell-marker-style">
      .cell-marker{
        display: none;
      }
    </style>
  </head>
  <body onkeydown="bodyKeyPress(event)">
    <div id="loading-screen">
      <p>loading...</p>
    </div>
    <div id="dtd-holder">
      <h1 id="overall-heading"> ${dtd.name} </h1>
      <div id="control-bar">
        <button class="control-button" type="button" onclick="goHome()">🏠</button>
        <button data-activity-indicator="➕" data-return-indicator="✔️" class="control-button" type="button" onclick="newCell(this)">➕</button>
        <button data-activity-indicator="🖋️" data-return-indicator="✔️" id="edit-cell-button" class="control-button" type="button" onclick="editCell()">🖋️</button>
        <button data-activity-indicator="⛏️" data-return-indicator="✔️" class="control-button" type="button" onclick="repositionCell(this)">⛏️</button>
        <button data-activity-indicator="✖️" data-return-indicator="☠️" class="control-button" type="button" onclick="removeCell(this)">✖️</button>
        <a class="control-button" href="/file-management/download/${dtd.name}.dtd?url=${dtd.url}" download>⤓</a>
        <button class="control-button" type="button" onclick="window.alert('not yet implemented :/')">▶</button>
        <button class="control-button" type="button" onclick="deleteFile()">🗑️</button>
      </div>
      <div id="board-cover-layer" onclick="popBackIn()"></div>
      <div id="board">
        ${cells}
        ${tokenCells}
      </div>
    </div>
  </body>
  <script src="${js_path}pad.js"></script>
  <script>
    dtd_url = "${dtd.url}";
    num_rows = ${dtd['num-rows']};
    num_columns = ${dtd['num-columns']};
  </script>
</html>`
}

module.exports = {renderPad};
