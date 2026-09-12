const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const updatedHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete()) {
      alert("Sila lengkapkan semua ruangan sebelum menghantar.");
      return;
    }

    const candidateData = {
      ...(formData as Candidate),
      id: Math.random().toString(36).substr(2, 9),
      statusBorang: 'LENGKAP',
      statusTemuduga: 'MENUNGGU',
      statusTawaran: 'DALAM_PERTIMBANGAN',
      tarikhPermohonan: new Date().toISOString()
    };
    
    // Save locally first
    saveCandidate(candidateData as Candidate);
    
    // Send to Google Sheets via Web App API
    try {
      // Data mapping to match typical column names, adjust if necessary based on your Google Sheet columns
      const formPayload = new FormData();
      formPayload.append('ID', candidateData.id);
      formPayload.append('Tarikh', new Date().toLocaleString('ms-MY'));
      formPayload.append('Nama', candidateData.name || '');
      formPayload.append('IC', candidateData.ic || '');
      formPayload.append('Jantina', candidateData.jantina || '');
      formPayload.append('Sekolah', candidateData.namaSekolahRendah || '');
      formPayload.append('NamaWaris', candidateData.namaBapa || candidateData.namaIbu || '');
      formPayload.append('NoTelefon', candidateData.telefonBapa || candidateData.telefonIbu || '');
      formPayload.append('Status', 'LENGKAP');
      
      const response = await fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
        method: 'POST',
        body: formPayload
      });
      
      const result = await response.json();
      if(result.result === 'success') {
         console.log("Data successfully saved to Google Sheets");
      }
    } catch (error) {
      console.error("Error saving to Google Sheets:", error);
      // We don't block the UI if Google Sheets fails, since local save succeeded
    }

    setSubmitted(true);
    localStorage.removeItem('borang_draft');
  };`;

// Replace the old handleSubmit function
code = code.replace(/const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?localStorage\.removeItem\('borang_draft'\);\s*\};/, updatedHandleSubmit);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
