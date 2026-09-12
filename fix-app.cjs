const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Import useAppContext if not there
if (!code.includes('useAppContext')) {
  code = code.replace("import { AppProvider } from './store';", "import { AppProvider, useAppContext } from './store';");
}

// Inside AppContent
if (!code.includes('const { settings }')) {
  code = code.replace("function AppContent() {", "function AppContent() {\n  const { settings } = useAppContext();\n  const sesiKemasukan = settings?.sesiKemasukan || 'Sesi Kemasukan 2026/2027';");
}

fs.writeFileSync('src/App.tsx', code);
