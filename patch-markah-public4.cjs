const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

// The replacement above failed because the text had duplicate var names. Let's do it using regex to match the duplicate block and replace it correctly for both Tahfiz and Akademik.

const duplicateBlock = `    // Check against configured max scores
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

const blockForTahfiz = `    const tahfizItemsConfig = settings.tahfizItems || [];
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


code = code.replace(duplicateBlock, blockForTahfiz);
code = code.replace(duplicateBlock, blockForTahfiz); // Just in case it's there twice

fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
