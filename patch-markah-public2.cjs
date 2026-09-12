const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/AdminPanel.tsx', 'utf8');

// The replacement above matched both functions but might have replaced twice in one function if names matched exactly.
// Let's check how many times the function exists.
