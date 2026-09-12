const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/tarikhDinilai\?: string;\s*};\s*markahAkademik\?: {/g, 'tarikhDinilai?: string;\n    catatan?: string;\n  };\n  markahAkademik?: {');
code = code.replace(/tarikhDinilai\?: string;\s*};\s*statusTawaran:/g, 'tarikhDinilai?: string;\n    catatan?: string;\n  };\n  statusTawaran:');

fs.writeFileSync('src/types.ts', code);
console.log("Patched types.ts with catatan using regex");
