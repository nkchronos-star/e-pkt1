const fs = require('fs');

let storeCode = fs.readFileSync('src/store.tsx', 'utf8');

// Find the start of the useEffect for firebase
const startIndex = storeCode.indexOf('useEffect(() => {\n    const unsubscribe = onAuthStateChanged');
if (startIndex !== -1) {
  const endIndex = storeCode.indexOf('  }, []);\n\n  useEffect(() => {\n    fetch(\'https://script.google.com');
  if (endIndex !== -1) {
    storeCode = storeCode.substring(0, startIndex) + storeCode.substring(endIndex + 11);
  }
}

fs.writeFileSync('src/store.tsx', storeCode);
