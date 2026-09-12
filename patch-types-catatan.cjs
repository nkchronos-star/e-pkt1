const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(`    dinilaiOleh?: string;
    tarikhDinilai?: string;
  };
  markahAkademik?: {`, `    dinilaiOleh?: string;
    tarikhDinilai?: string;
    catatan?: string;
  };
  markahAkademik?: {`);

code = code.replace(`    dinilaiOleh?: string;
    tarikhDinilai?: string;
  };
  statusTawaran:`, `    dinilaiOleh?: string;
    tarikhDinilai?: string;
    catatan?: string;
  };
  statusTawaran:`);

fs.writeFileSync('src/types.ts', code);
console.log("Patched types.ts with catatan");
