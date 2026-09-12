const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetStorage = `        // Create a copy of formData without large images for local draft to avoid QuotaExceededError
        const draftData = { ...formData };`;

const replacementStorage = `        // Create a copy of formData without large images for local draft to avoid QuotaExceededError
        const draftData = JSON.parse(JSON.stringify(formData));`;

if (code.includes('const draftData = { ...formData };')) {
  code = code.replace(targetStorage, replacementStorage);
  fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
  console.log("Patched Borang.tsx deep copy.");
} else {
  console.log("Could not find the target code block.");
}
