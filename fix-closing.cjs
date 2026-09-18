const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/SemakTawaran.tsx', 'utf8');

const regex = /<\/div>\s*<\/div>\s*<\/div>\s*\)\s*:\s*result\.statusTawaran === 'GAGAL'/;
const match = code.match(regex);
if (match) {
    console.log("Match found!");
    code = code.replace(regex, `</>\n               </div>\n            </div>\n          ) : result.statusTawaran === 'GAGAL'`);
    fs.writeFileSync('src/components/dashboard/SemakTawaran.tsx', code);
    console.log("Fixed closing tag");
} else {
    console.log("Match NOT found");
}

