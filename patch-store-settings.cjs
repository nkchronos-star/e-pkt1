const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const targetSync = `  const syncSettingsToServer = () => {
    const sheetData = new FormData();
    sheetData.append('action', 'updateSettings');
    const currentSettings = state.settings;
    Object.keys(currentSettings).forEach(key => {
      sheetData.append(key, String(currentSettings[key]));
    });`;

const replaceSync = `  const syncSettingsToServer = () => {
    const sheetData = new FormData();
    sheetData.append('action', 'updateSettings');
    const currentSettings = state.settings;
    Object.keys(currentSettings).forEach(key => {
      let val = currentSettings[key];
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      } else {
        val = String(val);
      }
      sheetData.append(key, val);
    });`;

code = code.replace(targetSync, replaceSync);

const targetFetch = `          if(parsed.borangBuka === 'true' || parsed.borangBuka === true) parsed.borangBuka = true;
          else if(parsed.borangBuka === 'false' || parsed.borangBuka === false) parsed.borangBuka = false;
          
          if(parsed.temudugaBuka === 'true' || parsed.temudugaBuka === true) parsed.temudugaBuka = true;
          else if(parsed.temudugaBuka === 'false' || parsed.temudugaBuka === false) parsed.temudugaBuka = false;
          
          if(parsed.tawaranBuka === 'true' || parsed.tawaranBuka === true) parsed.tawaranBuka = true;
          else if(parsed.tawaranBuka === 'false' || parsed.tawaranBuka === false) parsed.tawaranBuka = false;`;

const replaceFetch = `          if(parsed.borangBuka === 'true' || parsed.borangBuka === true) parsed.borangBuka = true;
          else if(parsed.borangBuka === 'false' || parsed.borangBuka === false) parsed.borangBuka = false;
          
          if(parsed.temudugaBuka === 'true' || parsed.temudugaBuka === true) parsed.temudugaBuka = true;
          else if(parsed.temudugaBuka === 'false' || parsed.temudugaBuka === false) parsed.temudugaBuka = false;
          
          if(parsed.tawaranBuka === 'true' || parsed.tawaranBuka === true) parsed.tawaranBuka = true;
          else if(parsed.tawaranBuka === 'false' || parsed.tawaranBuka === false) parsed.tawaranBuka = false;

          try {
             if (typeof parsed.tahfizItems === 'string') parsed.tahfizItems = JSON.parse(parsed.tahfizItems);
          } catch(e) {}
          try {
             if (typeof parsed.akademikItems === 'string') parsed.akademikItems = JSON.parse(parsed.akademikItems);
          } catch(e) {}`;

code = code.replace(targetFetch, replaceFetch);

fs.writeFileSync('src/store.tsx', code);
