const fs = require('fs');

const path = 'c:/Mechnnovationtech/apps/web/src/pages/public-pages.jsx';
const txt = fs.readFileSync(path, 'utf8');
const obj = { lines: txt.split('\n').slice(148, 430) };

fs.writeFileSync('c:/Mechnnovationtech/apps/web/src/pages/out.json', JSON.stringify(obj, null, 2), 'utf8');
console.log('done writing JSON');
