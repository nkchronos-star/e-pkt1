const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const oldFunc = `  const updateSettings = (newSettings: Partial<ApplicationSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }));
  };`;

const newFunc = `  const updateSettings = (newSettings: Partial<ApplicationSettings>) => {
    setState(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }));
  };

  const syncSettingsToServer = () => {
    const sheetData = new FormData();
    sheetData.append('action', 'updateSettings');
    const currentSettings = state.settings;
    Object.keys(currentSettings).forEach(key => {
      sheetData.append(key, String(currentSettings[key]));
    });

    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      body: sheetData
    }).then(() => alert('Tetapan berjaya diselaraskan ke Pangkalan Data (Google Sheets)!'))
      .catch(e => console.error("Sync error", e));
  };
  
  // We'll also try to fetch settings on load
  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec?action=getSettings')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error && Object.keys(data).length > 0) {
          // Convert strings to booleans where necessary
          const parsed = { ...data };
          if(parsed.borangBuka === 'true' || parsed.borangBuka === true) parsed.borangBuka = true;
          else if(parsed.borangBuka === 'false' || parsed.borangBuka === false) parsed.borangBuka = false;
          
          if(parsed.temudugaBuka === 'true' || parsed.temudugaBuka === true) parsed.temudugaBuka = true;
          else if(parsed.temudugaBuka === 'false' || parsed.temudugaBuka === false) parsed.temudugaBuka = false;
          
          if(parsed.tawaranBuka === 'true' || parsed.tawaranBuka === true) parsed.tawaranBuka = true;
          else if(parsed.tawaranBuka === 'false' || parsed.tawaranBuka === false) parsed.tawaranBuka = false;

          setState(prev => ({ ...prev, settings: { ...prev.settings, ...parsed } }));
        }
      }).catch(e => console.log('Offline/No settings fetched yet'));
  }, []);
`;

if (code.includes(oldFunc)) {
    code = code.replace(oldFunc, newFunc);
    fs.writeFileSync('src/store.tsx', code);
    console.log("Success patching store.tsx");
} else {
    console.log("Could not find oldFunc");
}
