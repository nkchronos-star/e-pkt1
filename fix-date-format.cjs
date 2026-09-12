const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/SemakTemuduga.tsx', 'utf8');

const replacement = `Tarikh semakan akan dibuka: <span className="font-semibold">{new Date(settings.tarikhBukaTemuduga).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</span>`;
code = code.replace(/Tarikh semakan akan dibuka: <span className="font-semibold">\{settings.tarikhBukaTemuduga\}<\/span>/, replacement);

fs.writeFileSync('src/components/dashboard/SemakTemuduga.tsx', code);
