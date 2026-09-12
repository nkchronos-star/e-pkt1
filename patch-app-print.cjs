const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Hide header on print
const headerMatch = `<header className="bg-[#0c6b4b] text-white">`;
const headerReplace = `<header className="bg-[#0c6b4b] text-white print:hidden">`;
if (code.includes(headerMatch)) {
   code = code.replace(headerMatch, headerReplace);
}

// Hide mobile menu on print
const mobileMenuMatch = `<div className="md:hidden bg-[#0a5a3f] text-white border-t border-emerald-800">`;
const mobileMenuReplace = `<div className="md:hidden bg-[#0a5a3f] text-white border-t border-emerald-800 print:hidden">`;
if (code.includes(mobileMenuMatch)) {
   code = code.replace(mobileMenuMatch, mobileMenuReplace);
}

fs.writeFileSync('src/App.tsx', code);
console.log("Added print:hidden to App layout");
