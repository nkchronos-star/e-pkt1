const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const regex = /<div className="mt-8 p-4 bg-slate-50 border border-slate-200\/60 rounded-xl text-xs text-slate-500 text-center font-medium">[\s\S]*?<\/div>/;

if (regex.test(code)) {
    code = code.replace(regex, '');
    fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
    console.log("Patched successfully");
} else {
    console.log("Regex did not match");
}
