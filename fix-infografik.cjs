const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Utama.tsx', 'utf8');

// Replace the hardcoded google drive link with the direct postimages link
code = code.replace(
    'src="https://drive.google.com/uc?export=view&id=16H5IrMcnjppOwvxH4NSPjE9NhiIm07ku"', 
    'src="https://i.postimg.cc/yNK9VCKH/infografik.png"'
);

fs.writeFileSync('src/components/dashboard/Utama.tsx', code);
