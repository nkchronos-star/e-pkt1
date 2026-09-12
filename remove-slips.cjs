const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// 1. Remove the sheetData.append calls for slips
code = code.replace("      sheetData.append('URL_Slip_PBD', newCandidate.pbd?.slipUrl || '');", "");
code = code.replace("      sheetData.append('URL_Slip_PBD_D6', newCandidate.pbdD6?.slipUrl || '');", "");
code = code.replace("      sheetData.append('URL_Slip_UPKK', newCandidate.upkk?.slipUrl || '');", "");

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
