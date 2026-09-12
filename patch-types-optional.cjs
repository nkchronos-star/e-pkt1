const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/hafazan: number;/g, 'hafazan?: number;');
code = code.replace(/tilawah: number;/g, 'tilawah?: number;');
code = code.replace(/sahsiah: number;/g, 'sahsiah?: number;');
code = code.replace(/bm: number;/g, 'bm?: number;');
code = code.replace(/bi: number;/g, 'bi?: number;');
code = code.replace(/sains: number;/g, 'sains?: number;');
code = code.replace(/matematik: number;/g, 'matematik?: number;');

fs.writeFileSync('src/types.ts', code);
console.log("Patched types.ts to make marks optional");
