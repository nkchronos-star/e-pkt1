const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// Replace the !firebaseUser block
const loginBlockRegex = /if \(\!firebaseUser\) \{[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*\);\s*\}/;
code = code.replace(loginBlockRegex, '');

// Also remove setDoc firestore usages
code = code.replace(/import \{ db, handleFirestoreError, OperationType \} from '\.\.\/\.\.\/lib\/firebase';\n/, '');
code = code.replace(/import \{ doc, getDoc, setDoc, serverTimestamp \} from 'firebase\/firestore';\n/, '');

// Remove saveDraft to firestore completely
code = code.replace(/const saveDraft = async \(\) => \{[\s\S]*?\}\;\n/, 'const saveDraft = async () => {};\n');

// Update useEffect to remove firestore fetch
const useEffectRegex = /useEffect\(\(\) => \{[\s\S]*?\}\, \[firebaseUser\]\);/;
code = code.replace(useEffectRegex, '');

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
