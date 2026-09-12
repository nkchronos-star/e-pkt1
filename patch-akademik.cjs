const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const target = `  const saveAll = () => {
     const today = new Date().toISOString().split('T')[0];
     let count = 0;
     
     Object.keys(bulkMarks).forEach(ic => {`;

const replacement = `  const saveAll = () => {
     const today = new Date().toISOString().split('T')[0];
     let count = 0;

     // Validate maximum scores before saving
     const itemsConfig = settings.akademikItems || [];
     let hasError = false;

     for (const ic of Object.keys(bulkMarks)) {
        const marks = bulkMarks[ic];
        for (const conf of itemsConfig) {
           const mark = marks[conf.id] || 0;
           if (mark > conf.weight) {
              const candidateName = eligibleCandidates.find(c => c.ic === ic)?.name || ic;
              alert(\`Ralat pada \${candidateName}: Markah untuk "\${conf.name}" tidak boleh melebihi \${conf.weight}.\`);
              hasError = true;
              break;
           }
        }
        if (hasError) break;
     }

     if (hasError) return;

     Object.keys(bulkMarks).forEach(ic => {`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
