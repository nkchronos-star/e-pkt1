const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const targetChange = `        localStorage.setItem('akademik_draft', JSON.stringify(next));`;

const replacementChange = `        try {
           localStorage.setItem('akademik_draft', JSON.stringify(next));
        } catch(e) {}`;

if (code.includes(targetChange)) {
  code = code.replace(targetChange, replacementChange);
  fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
  console.log("Patched AdminPanel.tsx localStorage.setItem.");
} else {
  console.log("Could not find the target code block.");
}
