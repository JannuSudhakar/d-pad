function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function chooseRand(lst){
  const min = 0;
  const max = lst.length;
  return lst[getRndInteger(min,max)];
}

module.exports = {
  getRndInteger: getRndInteger,
  chooseRand: chooseRand
}
