const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `<main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">`;
const r1 = `<main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 print:p-0 print:m-0 print:max-w-none">`;

if (code.includes(t1)) code = code.replace(t1, r1);

fs.writeFileSync('src/App.tsx', code);
console.log("Success");
