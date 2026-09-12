const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(`    dinilaiOleh?: string;
  };`, `    dinilaiOleh?: string;
    tarikhDinilai?: string;
  };`);

code = code.replace(`    dinilaiOleh?: string;
  };`, `    dinilaiOleh?: string;
    tarikhDinilai?: string;
  };`);

fs.writeFileSync('src/types.ts', code);
console.log("Patched types.ts");
