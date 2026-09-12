const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const tahfizTarget = `    // Check against configured max scores
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
    if (hasError) return;

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

const tahfizReplacement = `    // Check against configured max scores (Tahfiz)
    const tahfizItemsConfig = settings.tahfizItems || [];
    let tahfizHasError = false;
    for (const conf of tahfizItemsConfig) {
      const mark = markah.items[conf.id] || 0;
      if (mark > conf.weight) {
        alert(\`Markah untuk "\${conf.name}" tidak boleh melebihi \${conf.weight}.\`);
        tahfizHasError = true;
        break;
      }
    }
    if (tahfizHasError) return;`;

code = code.replace(tahfizTarget, tahfizReplacement);


const akademikTarget = `    // Check against configured max scores
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
    if (hasError) return;

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

const akademikReplacement = `    // Check against configured max scores (Akademik)
    const akademikItemsConfig = settings.akademikItems || [];
    let akademikHasError = false;
    for (const conf of akademikItemsConfig) {
      const mark = markah.items[conf.id] || 0;
      if (mark > conf.weight) {
        alert(\`Markah untuk "\${conf.name}" tidak boleh melebihi \${conf.weight}.\`);
        akademikHasError = true;
        break;
      }
    }
    if (akademikHasError) return;`;

// wait, the error happened because the block was duplicated in BOTH functions, so I need to replace it carefully.
