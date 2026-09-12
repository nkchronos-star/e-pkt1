const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const tahfizTarget = `  const handleSubmit = (e: React.FormEvent, isEdit: boolean = false) => {
    e.preventDefault();
    const targetIc = isEdit ? editId : selectedCandidate;
    if (!targetIc) return;`;

const tahfizReplacement = `  const handleSubmit = (e: React.FormEvent, isEdit: boolean = false) => {
    e.preventDefault();
    const targetIc = isEdit ? editId : selectedCandidate;
    if (!targetIc) return;

    // Check against configured max scores
    const itemsConfig = settings.tahfizItems || [];
    let hasError = false;
    for (const conf of itemsConfig) {
      const mark = markah.items[conf.id] || 0;
      if (mark > conf.weight) {
        alert(\`Markah untuk "\${conf.name}" tidak boleh melebihi \${conf.weight}.\`);
        hasError = true;
        break;
      }
    }
    if (hasError) return;`;

code = code.replace(tahfizTarget, tahfizReplacement);

const akademikTarget = `  const handleSubmit = (e: React.FormEvent, isEdit: boolean = false) => {
    e.preventDefault();
    const targetIc = isEdit ? editId : selectedCandidate;
    if (!targetIc) return;`;

const akademikReplacement = `  const handleSubmit = (e: React.FormEvent, isEdit: boolean = false) => {
    e.preventDefault();
    const targetIc = isEdit ? editId : selectedCandidate;
    if (!targetIc) return;

    // Check against configured max scores
    const itemsConfig = settings.akademikItems || [];
    let hasError = false;
    for (const conf of itemsConfig) {
      const mark = markah.items[conf.id] || 0;
      if (mark > conf.weight) {
        alert(\`Markah untuk "\${conf.name}" tidak boleh melebihi \${conf.weight}.\`);
        hasError = true;
        break;
      }
    }
    if (hasError) return;`;

code = code.replace(akademikTarget, akademikReplacement);

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
