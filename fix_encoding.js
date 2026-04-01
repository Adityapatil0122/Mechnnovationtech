const fs = require('fs');
const path = 'c:/Mechnnovationtech/apps/web/src/pages/public-pages.jsx';
let buf;
try {
  buf = fs.readFileSync(path);
  // Using latin1 or utf8
  let text = buf.toString('utf8');
  if (text.includes('')) {
    text = buf.toString('latin1');
    text = text.replace(/\xA9/g, "©");
  }

  // Also fix Mechnnovation to Mechnno Vation
  let newText = text.replace(/Mechnnovation(?! Vation)/g, "Mechnno Vation");

  fs.writeFileSync(path, newText, 'utf8');
  console.log("Success");
} catch(e) {
  console.log(e);
}
