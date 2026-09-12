const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

const endPart = `       </section>
    </div>
  );
}`;

const replaceEndPart = `       </section>
       </div>
       )}
    </div>
  );
}`;

code = code.replace(endPart, replaceEndPart);
fs.writeFileSync('src/components/dashboard/AdminPanel.tsx', code);
