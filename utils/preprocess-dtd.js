const {validCellTypes} = require('./globals');

MathJax = {
  tex: {packages: ['base', 'autoload', 'require', 'ams', 'newcommand']},
  startup: {typeset: false},
  loader: {require: require}
}

require('mathjax-full/components/src/startup/lib/startup.js');
require('mathjax-full/components/src/core/core.js');
require('mathjax-full/components/src/adaptors/liteDOM/liteDOM.js');
require('mathjax-full/components/src/input/tex-base/tex-base.js');
require('mathjax-full/components/src/input/tex/extensions/all-packages/all-packages.js');
require('mathjax-full/components/src/output/chtml/chtml.js');
require('mathjax-full/components/src/output/chtml/fonts/tex/tex.js');
require('mathjax-full/components/src/a11y/assistive-mml/assistive-mml.js');
require('mathjax-full/components/src/startup/startup.js');

MathJax.loader.preLoad(
  'core',
  'adaptors/liteDOM',
  'input/tex-base',
  '[tex]/all-packages',
  'output/chtml',
  'output/chtml/fonts/tex',
  'a11y/assistive-mml'
);
MathJax.config.startup.ready();
const adaptor = MathJax.startup.adaptor;

function preprocess(dtd){
  style = `
  #board{
    grid-template-rows: repeat(${dtd['num-rows']},${100/dtd['num-rows']}%);
    grid-template-columns: repeat(${dtd['num-columns']},${100/dtd['num-columns']}%);
  }
  ${dtd['base-style']};
  ${adaptor.textContent(MathJax.chtmlStylesheet())}
  `;
  cells = dtd.cells.map(function(cell){
    console.log(cell['cell-type']);
    if(validCellTypes.reduce(function(ret,elt){
      return ret || elt == cell['cell-type'];
    },false)){
      inlineStyle = `
      grid-column-start: ${cell["grid-column-start"]};
      grid-row-start: ${cell["grid-row-start"]};
      grid-column-end: ${cell["grid-column-end"]};
      grid-row-end: ${cell["grid-row-end"]};
      ${cell["inline-style"] || ""};
      `;
      if(cell['cell-type'] == "paragraph"){
        return {
          uid: cell.uid,
          type: "paragraph",
          inlineStyle: inlineStyle,
          content: `<p id=edit-${cell.uid}>${cell.content.replace(/</g,'&lt;').replace(/>/,'&gt;').replace(/\n/g,'<br>')}</p>` //escaped greater than and less than
        };
      }
      else if(cell['cell-type'] == "math"){
        const node = MathJax.tex2chtml(cell.content, {
          display: false,
          em: 16,
          ex: 8,
          containerWidth: 80*16
        });
        math = adaptor.outerHTML(node);

        return{
          uid: cell.uid,
          type: "math",
          inlineStyle: inlineStyle,
          content: `
          <p style="display: none;" id=edit-${cell.uid}>
          ${cell.content.replace(/</g,'&lt;').replace(/>/,'&gt;').replace(/\n/g,'<br>')}
          <p>
          ${math}
          `
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
