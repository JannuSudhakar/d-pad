//global constants
validCellTypes = ["paragraph","math"];

//state variables
var gridMarkerState = false;
var repositioningState = false;
var cellBeingRepositioned = "";
var cellEditState = false;
var cellBeingEdited = "";
var loadingScreenState = false;
var removeState = false;
var cellBeingRemoved = "";
var cellPoppedOutState = false;

var doubleClickIndicator = false;

var rowSet1 = null;
var rowSet2 = null;
var colSet1 = null;
var colSet2 = null;

function sleep(ms) {
  if(!ms){
    ms = 0;
  }
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleLoadingScreen(forceState){
  if(forceState != null){
    loadingScreenState = forceState;
  }
  else{
    loadingScreenState = !loadingScreenState;
  }

  if(loadingScreenState){
    document.getElementById("loading-screen").style.display = "block";
  }
  else{
    document.getElementById("loading-screen").style.display = "none";
  }
}

function toggleDisableOnControlButtons(x){
  //pass nothing to this function to activate all buttons.
  //pass true here to disable all buttons.
  buttons = document.getElementsByClassName('control-button');
  if(x){
    for(var i = 0; i < buttons.length; i++){
      buttons[i].disabled = true;
    }
    if(x.disabled){
      x.disabled = false;
    }
  }
  else{
    for(var i = 0; i < buttons.length; i++){
      buttons[i].disabled = false;
    }
  }
}

function toggleIcon(x){
  activityIndicator = x.getAttribute("data-activity-indicator");
  returnIndicator = x.getAttribute("data-return-indicator");
  if(x.innerHTML != activityIndicator){
    x.innerHTML = activityIndicator;
  }
  else{
    x.innerHTML = returnIndicator;
  }
}

function toggleContolBar(id){
  var bars = document.getElementsByClassName('control-bar');
  for(var i = 0; i < bars.length; i++){
    bars[i].style.display = "none";
  }
  document.getElementById(id).style.display = "";
}

function setGridVisibility(visibility){
  for(var i = 1; i <= num_rows; i++){
    for(var j = 1; j <= num_columns; j++){
      document.getElementById(`row-${i}-col-${j}`).style.backgroundColor = "transparent";
      document.getElementById(`row-${i}-col-${j}`).style.outline = "none";
    }
  }
  document.getElementById("cell-marker-style").innerHTML = `.cell-marker{
    display: ${visibility ? "block" : "none"};
  }`
}

function sendPOST(url,data){
  return new Promise(function(resolutionFunction,rejectionFunction){
    xhttp = new window.XMLHttpRequest();
    xhttp.open("POST",url);
    xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhttp.send(data);
    xhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        resolutionFunction(this.responseText)
      }
    }
  })
}

function setCellClickableIndicator(clickable){
  if(clickable){
    cells = document.getElementsByClassName("dtd-cell");
    for (var i = 0; i < cells.length; i++){
      cells[i].classList.add("dtd-cell-clickable");
    }
  }
  else{
    cells = document.getElementsByClassName("dtd-cell");
    for (var i = 0; i < cells.length; i++){
      cells[i].classList.remove("dtd-cell-clickable");
      cells[i].classList.remove("dtd-cell-selected");
    }
  }
}

function goHome(){
  window.location.href = "/";
}

async function newCell(x){
  toggleDisableOnControlButtons(gridMarkerState? null : x);
  gridMarkerState = !gridMarkerState;
  setGridVisibility(gridMarkerState)
  if(!gridMarkerState){
    if(rowSet1 != null && rowSet2 != null && colSet1 != null && colSet2 != null){
      toggleLoadingScreen();
      var responseText = await sendPOST(`/edit/create/${dtd_url}`,`cellType=paragraph&rowSet1=${rowSet1}&rowSet2=${rowSet2}&colSet1=${colSet1}&colSet2=${colSet2}`)
      if(JSON.parse(responseText).error){
        window.alert("the create cell operation failed :(");
        toggleLoadingScreen();
      }
      else{
        location.reload();
      }
    }
  }
  toggleIcon(x)
  rowSet1 = null;
  rowSet2 = null;
  colSet1 = null;
  colSet2 = null;
}

function setCellCorner(row,col){
  rowSet1 = rowSet2 || row;
  colSet1 = colSet2 || col;
  rowSet2 = row;
  colSet2 = col;
  startRow = Math.min(rowSet1,rowSet2);
  endRow = Math.max(rowSet1,rowSet2);
  startCol = Math.min(colSet1,colSet2);
  endCol = Math.max(colSet1,colSet2);
  for(var i = 1; i <= num_rows; i++){
    for(var j = 1; j <= num_columns; j++){
      document.getElementById(`row-${i}-col-${j}`).style.backgroundColor = (startRow <= i && i <= endRow && startCol <= j && j <= endCol) ? "#ffe4b578" : "transparent";
      document.getElementById(`row-${i}-col-${j}`).style.outline = "none";
    }
  }
  document.getElementById(`row-${row}-col-${col}`).style.outline = "1px dashed green";
}

async function repositionCell(x){
  toggleDisableOnControlButtons(repositioningState? null : x);
  repositioningState = !repositioningState;
  if(repositioningState){
    setCellClickableIndicator(true);
  }
  else{
    if(rowSet1 != null && rowSet2 != null && colSet1 != null && colSet2 != null){
      toggleLoadingScreen();
      var responseText = await sendPOST(`/edit/reposition/${dtd_url}`,`cellUID=${cellBeingRepositioned}&rowSet1=${rowSet1}&rowSet2=${rowSet2}&colSet1=${colSet1}&colSet2=${colSet2}`);
      if(JSON.parse(responseText).error){
        toggleLoadingScreen();
        window.alert("the reposition operation failed :(");
      }
      else{
        location.reload();
      }
    }
    setCellClickableIndicator(false);
    setGridVisibility(repositioningState);
    cellBeingRepositioned = "";
  }
  toggleIcon(x);
}

async function editCell(){
  x = document.getElementById('edit-cell-button');
  toggleContolBar("edit-cell-control-bar");
  //properly initializing the edit-cell control bar
  toggleDisableOnControlButtons(true);
  document.getElementById("abort-edit-button").disabled = false;
  document.getElementById("edit-cell-submit-button").disabled = false;
  cellEditState = !cellEditState;
  if(cellEditState){
    setCellClickableIndicator(true);
  }
  else{
    theGlobalEscape();
  }
}

async function editCellSubmit(){
  if(cellBeingEdited != ""){
    var cellType = document.getElementById(`cell-${cellBeingEdited}`).getAttribute('data-cell-type');
    var content = document.getElementById(`edit-${cellBeingEdited}`).innerHTML;
    content = content.replace(/<br>/g,"\n");
    content = content.replace(/<div>/g,"\n");
    content = content.replace(/<\/div>/g,"");
    toggleLoadingScreen();
    responseText = await sendPOST(`/edit/edit/${dtd_url}`,`cellUID=${cellBeingEdited}&content=${encodeURIComponent(content)}&celltype=${cellType}`);
    if(JSON.parse(responseText).error){
      toggleLoadingScreen();
      toggleDisableOnControlButtons();
      window.alert("the edit cell operation failed :(");
      cellBeingEdited = "";
    }
    else{
      location.reload();
    }
  }
  else{
    toggleDisableOnControlButtons();
    setCellClickableIndicator();
  }
}

function setCellType(type){
  if(cellBeingEdited == ""){
    theGlobalEscape();
  }
  else{
    console.log(cellBeingEdited);
    var cell = document.getElementById(`cell-${cellBeingEdited}`);
    cell.setAttribute("data-cell-type",type);
    for(var i = 0; i < validCellTypes.length; i++){
      if(validCellTypes[i] != type){
        document.getElementById(`cell-type-selector-button-${validCellTypes[i]}`).disabled = false;
      }
      else{
        document.getElementById(`cell-type-selector-button-${validCellTypes[i]}`).disabled = true;
      }
    }
  }
}

async function removeCell(x){
  toggleDisableOnControlButtons(x);
  toggleIcon(x);
  removeState = !removeState
  if(removeState){
    cellBeingRemoved = "";
    setCellClickableIndicator(true);
  }
  else if(cellBeingRemoved != ""){
    toggleLoadingScreen();
    responseText = await sendPOST(`/edit/remove/${dtd_url}`,`cellUID=${cellBeingRemoved}`);
    if(JSON.parse(responseText).error){
      toggleLoadingScreen();
      window.alert("the remove cell operation failed :( \n- is it really sad?...");
      cellBeingRemoved = "";
      setCellClickableIndicator(false);
      toggleDisableOnControlButtons();
    }
    else{
      location.reload();
    }
  }
  else{
    setCellClickableIndicator(false);
    toggleDisableOnControlButtons();
  }
}

async function clickCell(cell){
  if(!doubleClickIndicator){
    await sleep(200);
  }
  else{
    doubleClickIndicator = true;
    return
  }
  var uid = cell.id.substr(5);
  if(repositioningState){
    cellBeingRepositioned = uid;
    setCellClickableIndicator(false);
    cell.classList.add("dtd-cell-selected");
    rowSet1 = null;
    rowSet2 = null;
    colSet1 = null;
    colSet2 = null;
    setGridVisibility(repositioningState);
  }
  else if(cellEditState){
    if(cellBeingEdited == ""){
      cellBeingEdited = uid;
      setCellClickableIndicator(false);
      cell.classList.add("dtd-cell-being-edited");
      document.getElementById(`edit-${uid}`).contentEditable = "true";
      cellType = cell.getAttribute('data-cell-type');
      for(var i = 0; i < validCellTypes.length; i++){
        if(validCellTypes[i] != cellType){
          document.getElementById(`cell-type-selector-button-${validCellTypes[i]}`).disabled = false;
        }
      }
      if(cellType == "math"){
        var children = cell.children;
        for(var i = 0; i < children.length; i++){
          children[i].style.display = "none";
        }
        document.getElementById(`edit-${uid}`).style.display = "";
      }
      document.getElementById(`edit-${uid}`).addEventListener("keypress",function(event){
        if(event.key == "Enter" && !event.shiftKey){
          editCellSubmit();
        }
      })
      document.getElementById(`edit-${uid}`).focus();
    }
  }
  else if(removeState){
    cellBeingRemoved = uid;
    setCellClickableIndicator(false);
    cell.classList.add("dtd-cell-selected");
  }
  else{
    cell.classList.add("dtd-cell-popped-out");
    document.getElementById("board-cover-layer").style.display = "grid";
    toggleDisableOnControlButtons(true);
    cellPoppedOutState = true;
  }
}

function dblClickCell(x){
  if(!cellEditState && cellBeingEdited == ""){
    doubleClickIndicator = true;
    editCell();
    clickCell(x);
  }
}

function popBackIn(){
  var poppedCells = document.getElementsByClassName("dtd-cell-popped-out");
  if(poppedCells.length == 0){
    window.alert("poppedCells.length == 0.\nReport to the developer.\nHopefully nothing broke");
  }
  else{
    for(var i  = 0; i < poppedCells.length; i++){
      poppedCells[i].classList.remove("dtd-cell-popped-out");
    }
  }
  document.getElementById("board-cover-layer").style.display = "none";
  toggleDisableOnControlButtons(false);
  cellPoppedOutState = false;
}

function deleteFile(){
  if(window.confirm("-------------☠️💀Hey there heads up💀☠️-------------\n☠️🦴💀this will permanently delete this file💀🦴☠️")){
    xhttp = new window.XMLHttpRequest();
    xhttp.open("DELETE",`/edit/delete/${dtd_url}`);
    toggleLoadingScreen();
    xhttp.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        toggleLoadingScreen();
        if(JSON.parse(this.responseText).error){
          window.alert('there was an error deleting the file.\nFile: "whew, that was a close one 😎"');
        }
        else{
          window.location.href = "/";
        }
      }
    }
    xhttp.send();
  }
  else{
    window.alert("you have chosen to not delete this file.")
  }
}

function bodyKeyPress(event){
  if(event.key == "Escape"){
    if(cellPoppedOutState){
      popBackIn();
    }
    else{
      theGlobalEscape();
    }
  }
}

async function downloadFile(){
  response = JSON.parse(await sendPOST( `/file-management/download/${dtd_url}`));
  if(response.error){
    window.alert("the download failed :(");
    return
  }
  stringified_dtd = response.stringified_dtd;
  window.alert(stringified_dtd);
}

async function theGlobalEscape(){
  //I am lazy, very lazy. If you have a problem with that come and kill me.
  I_dont_know_why_this_is_needed = JSON.parse(await sendPOST(`/`));
  location.reload();
}

function makeScrollable(x){
  children = x.children;
  for(var i = 0; i < children.length; i++){
    children[i].style.overflow = "auto";
  }
}

function undoScrollable(x){
  var children = x.children;
  for(var i = 0; i < children.length; i++){
    children[i].style.overflow = "";
  }
}
