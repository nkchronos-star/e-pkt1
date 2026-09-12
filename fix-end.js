const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetIndex = code.lastIndexOf('</div>');
code = code.substring(0, targetIndex + 6) + '\n      </form>\n    </div>\n  );\n}\n';

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
