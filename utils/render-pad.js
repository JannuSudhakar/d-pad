function renderPad(baseurl,dtd,js_path,language_specific_info,errors,info){
  let cells = ""
  for(let i = 0; i < dtd.cells.length; i++){
    cell = dtd.cells[i];
    cells += `
    <div data-cell-type=${cell.type}
    class=dtd-cell id=cell-${cell.uid}
    style="${cell.inlineStyle}" onclick="clickCell(this)"
    ondblclick="dblClickCell(this)"
    onmouseover="makeScrollable(this)"
    onmouseleave="undoScrollable(this)">
    ${cell.content}</div>\n`;
  }
  let tokenCells = ""
  for(var row = 1; row < dtd["num-rows"]+1; row++){
    for(var column = 1; column < dtd["num-columns"]+1; column++){
      tokenCells += `<div class=cell-marker onclick="setCellCorner(${row},${column})" id=row-${row}-col-${column} style="grid-row-start: ${row}; grid-column-start: ${column};"></div>\n`
    }
  }
  return `<html>
  <head>
    <title>${dtd.name}</title>
    <base href="${baseurl || '/'}">
    <link rel="stylesheet" type="text/css" href="/dtd-style1.css">
    <style>${dtd.style}</style>
    <style id="cell-marker-style">
      .cell-marker{
        display: none;
      }
    </style>
  </head>
  <body onkeydown="bodyKeyPress(event)">
    <div id="rotatemsg"> made to be viewed in landscape mode </div>
    <div id="loading-screen">
      <p>loading...</p>
    </div>
    <div id="dtd-holder">
      <h1 id="overall-heading"> ${dtd.name} </h1>
      <div class="control-bar" id="main-control-bar">
        <button class="control-button" type="button" onclick="goHome()" title="${language_specific_info["home-button-label"]}">🏠</button>
        <button data-activity-indicator="➕" data-return-indicator="✔️" class="control-button" type="button" onclick="newCell(this)" title="${language_specific_info["new-cell-label"]}">➕</button>
        <button data-activity-indicator="🖋️" data-return-indicator="✔️" id="edit-cell-button" class="control-button" type="button" onclick="editCell()" title="${language_specific_info["edit-cell-label"]}">🖋️</button>
        <button data-activity-indicator="⛏️" data-return-indicator="✔️" class="control-button" type="button" onclick="repositionCell(this)" title="${language_specific_info["reposition-cell-label"]}">⛏️</button>
        <button data-activity-indicator="✖️" data-return-indicator="☠️" class="control-button" type="button" onclick="removeCell(this)" title="${language_specific_info["remove-cell-label"]}">✖️</button>
        <a class="control-button" href="/file-management/download/${dtd.name}.dtd?url=${dtd.url}" download title="${language_specific_info["download-file-label"]}">⤓</a>
        <button class="control-button" type="button" onclick="window.alert('not yet implemented :/')" title="not yet implemented">▶</button>
        <button class="control-button" type="button" onclick="deleteFile()" title="${language_specific_info["delete-file-label"]}">🗑️</button>
      </div>
      <div class="control-bar" id="edit-cell-control-bar" style="display: none">
        <button id="cell-type-selector-button-paragraph" class="control-button" type="button" onclick="setCellType('paragraph')" title="${language_specific_info["cell-type-selector-paragraph-label"]}">&lt;p&gt;</button>
        <!-- <button id="cell-type-selector-button-math" class="control-button" type="button" onclick="setCellType('math')" title="${language_specific_info["cell-type-selector-math-label"]}">Tex</button> --!>
        <button id="edit-cell-submit-button" class="control-button" type="button" onclick="editCellSubmit()" title="${language_specific_info["edit-cell-label"]}">✔️</button>
        <button data-activity-indicator="⬆️" data-return-indicator="↓" class="control-button" type="button" onclick="popCellBeingEdited()" title="${language_specific_info["pop-out-cell-label"]}">⬆️</button>
        <button id="abort-edit-button" class="control-button" type="button" onclick="theGlobalEscape()" title="${language_specific_info["global-escape-label"]}">🚫</button>
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
