const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

// I will just replace the exact wrapping tags.
// Currently:
// <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 no-print"></div>                              
// <div className="no-print">
//   <div className="inline-flex...
//
// Let's replace `<div className="no-print">` with `<>` and its matching `</div>` with `</>`? No, it's easier to just add `no-print` to the children.

// Let's just find `<div className="no-print">` on line 105.
code = code.replace(
    /<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 no-print"><\/div>[\s]*<div className="no-print">/,
    `<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 no-print"></div>
               <>
                 <div className="no-print">`
);

// We added `<div className="no-print">` wrapping just the top stuff:
code = code.replace(
    /{result\.maklumBalasTawaran \? \(/,
    `</div>\n                 {result.maklumBalasTawaran ? (`
);

// Now we need to add `<div className="no-print">` around the GAGAL and Tindakan Diperlukan parts?
// Wait, the "Anda Telah Menolak Tawaran Ini" and "Tindakan Diperlukan" will now NOT be in `.no-print`.
// So we should add `no-print` to them.

code = code.replace(
    /<div className="bg-red-50\/80 border border-red-200\/60 rounded-2xl p-8 shadow-inner">/,
    `<div className="bg-red-50/80 border border-red-200/60 rounded-2xl p-8 shadow-inner no-print">`
);

code = code.replace(
    /<div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200\/60 rounded-2xl p-8 relative shadow-lg shadow-amber-100\/20">/,
    `<div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-8 relative shadow-lg shadow-amber-100/20 no-print">`
);

// And we need to remove the closing `</div>` that used to match the `no-print` div.
// It's right before `</div>\n            </div>\n          ) : result.statusTawaran === 'GAGAL'`

code = code.replace(
    /<\/div>\n               <\/div>\n            <\/div>\n          \) : result\.statusTawaran === 'GAGAL'/g,
    `</>\n               </div>\n            </div>\n          ) : result.statusTawaran === 'GAGAL'`
);

fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);
console.log("Success");
