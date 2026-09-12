const fs = require('fs');

['src/components/dashboard/SuratPanggilan.tsx', 'src/components/dashboard/SuratTawaran.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace <p>Pengetua</p> block with dynamic data
    // First, make sure useAppContext is imported and we get settings
    if (!code.includes('const { settings }')) {
      code = code.replace(/const Surat\w+ \= \(\{ cal[\s\S]*?\}\) \=\> \{/, (match) => {
        return match + '\n  const { settings } = useAppContext();';
      });
      if (!code.includes('useAppContext')) {
        code = "import { useAppContext } from '../../store';\n" + code;
      }
    }
    
    const pengetuaBlock = `
          {settings.tandatanganPengetua ? (
             <img src={settings.tandatanganPengetua} alt="Tandatangan" className="h-16 object-contain mb-2" />
          ) : (
             <br /><br /><br />
          )}
          <p className="font-bold">{settings.namaPengetua || 'PENGETUA'}</p>
          <p>Pengetua</p>
    `;
    
    code = code.replace(/<br \/><br \/><br \/>\s*<p>Pengetua<\/p>/, pengetuaBlock);
    
    fs.writeFileSync(file, code);
    console.log('Updated', file);
  }
});
