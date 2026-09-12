const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// 1. Add `isSubmitting` state
if (!code.includes('const [isSubmitting')) {
    code = code.replace(
        'const [submitted, setSubmitted] = useState(false);',
        'const [submitted, setSubmitted] = useState(false);\n  const [isSubmitting, setIsSubmitting] = useState(false);'
    );
}

// 2. Replace handleSubmit function
const oldSubmitStart = 'const handleSubmit = (e: React.FormEvent) => {';
const oldSubmitEndRegex = /const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?localStorage\.removeItem\('borang_draft'\);\s*\};/;

const newSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete()) {
      alert("Sila lengkapkan semua ruangan sebelum menghantar.");
      return;
    }

    setIsSubmitting(true);

    const newCandidate: Candidate = {
      ...(formData as Candidate),
      id: Math.random().toString(36).substr(2, 9),
      statusBorang: 'LENGKAP',
      statusTemuduga: 'MENUNGGU',
      statusTawaran: 'DALAM_PERTIMBANGAN',
    };

    try {
      // 1. Simpan ke sistem/local storage
      saveCandidate(newCandidate);

      // 2. Format data untuk dihantar ke Google Sheets Web App
      const sheetData = new FormData();
      sheetData.append('ID', newCandidate.id);
      sheetData.append('Tarikh', new Date().toISOString());
      sheetData.append('Nama', newCandidate.name || '');
      sheetData.append('IC', newCandidate.ic || '');
      sheetData.append('NoSijilLahir', newCandidate.noSijilLahir || '');
      sheetData.append('TarikhLahir', newCandidate.tarikhLahir || '');
      sheetData.append('TempatLahir', newCandidate.tempatLahir || '');
      sheetData.append('Jantina', newCandidate.jantina || '');
      sheetData.append('Alamat', \`\${newCandidate.alamat1 || ''} \${newCandidate.alamat2 || ''}, \${newCandidate.poskod || ''} \${newCandidate.daerah || ''}, \${newCandidate.negeri || ''}\`);
      sheetData.append('NamaSekolahRendah', newCandidate.namaSekolahRendah || '');
      
      sheetData.append('NamaBapa', newCandidate.namaBapa || '');
      sheetData.append('ICBapa', newCandidate.icBapa || '');
      sheetData.append('PekerjaanBapa', newCandidate.pekerjaanBapa || '');
      sheetData.append('TelefonBapa', newCandidate.telefonBapa || '');
      
      sheetData.append('NamaIbu', newCandidate.namaIbu || '');
      sheetData.append('ICIbu', newCandidate.icIbu || '');
      sheetData.append('PekerjaanIbu', newCandidate.pekerjaanIbu || '');
      sheetData.append('TelefonIbu', newCandidate.telefonIbu || '');

      sheetData.append('PBD_BM', newCandidate.pbd?.bm || '');
      sheetData.append('PBD_BI', newCandidate.pbd?.bi || '');
      sheetData.append('PBD_Math', newCandidate.pbd?.matematik || '');
      sheetData.append('PBD_Sains', newCandidate.pbd?.sains || '');

      sheetData.append('UPKK_AlQuran', newCandidate.upkk?.alquran || '');
      sheetData.append('UPKK_Akidah', newCandidate.upkk?.akidah || '');
      sheetData.append('UPKK_Sirah', newCandidate.upkk?.sirah || '');
      sheetData.append('UPKK_Adab', newCandidate.upkk?.adab || '');
      sheetData.append('UPKK_JawiKhat', newCandidate.upkk?.jawikhat || '');
      sheetData.append('UPKK_BahasaArab', newCandidate.upkk?.bahasaarab || '');
      sheetData.append('UPKK_Ibadah', newCandidate.upkk?.ibadah || '');

      // Send to Google Apps Script Web App
      await fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
        method: 'POST',
        body: sheetData
      });

      setSubmitted(true);
      localStorage.removeItem('borang_draft');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terdapat ralat semasa menghantar borang (Sambungan). Namun borang telah direkodkan dalam sistem. Sila hubungi admin.');
      setSubmitted(true);
      localStorage.removeItem('borang_draft');
    } finally {
      setIsSubmitting(false);
    }
  };`;

code = code.replace(oldSubmitEndRegex, newSubmit);

// 3. Replace the submit button
const oldButton = `<button 
                type="submit"
                className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-lg"
              >
                 <Send className="w-6 h-6" /> Hantar Permohonan
              </button>`;
const newButton = `<button 
                type="submit"
                disabled={isSubmitting}
                className={\`\${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-600/30 shadow-xl'} text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 text-lg\`}
              >
                 {isSubmitting ? (
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Send className="w-6 h-6" />
                 )}
                 {isSubmitting ? 'Menghantar...' : 'Hantar Permohonan'}
              </button>`;

code = code.replace(oldButton, newButton);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
