const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const footerMatch = `<footer className="bg-slate-900 text-slate-400 py-10 mt-auto no-print">`;
const footerReplace = `<footer className="bg-slate-900 text-slate-400 py-10 mt-auto print:hidden">`;
if (code.includes(footerMatch)) {
   code = code.replace(footerMatch, footerReplace);
   fs.writeFileSync('src/App.tsx', code);
}
