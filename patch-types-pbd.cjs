const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

const pbdD6 = `  pbd: {
    bm: string;
    bi: string;
    matematik: string;
    sains: string;
    slipUrl?: string;
  };
  pbdD6?: {
    bm: string;
    bi: string;
    matematik: string;
    sains: string;
    slipUrl?: string;
  };`;

code = code.replace(`  pbd: {
    bm: string;
    bi: string;
    matematik: string;
    sains: string;
    slipUrl?: string;
  };`, pbdD6);

fs.writeFileSync('src/types.ts', code);
