const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const missingFuncs = `
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev as any)[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => {
         let updates: any = { [name]: typeof value === 'string' ? value.toUpperCase() : value };
         
         // Poskod Auto Detect
         if (name === 'poskod' && value.length >= 2) {
             const prefix = value.substring(0, 2);
             const stateMap: Record<string, string> = {
                '01': 'Perlis', '02': 'Perlis', '05': 'Kedah', '06': 'Kedah', '07': 'Kedah', '08': 'Kedah', '09': 'Kedah',
                '10': 'Pulau Pinang', '11': 'Pulau Pinang', '12': 'Pulau Pinang', '13': 'Pulau Pinang', '14': 'Pulau Pinang',
                '15': 'Kelantan', '16': 'Kelantan', '17': 'Kelantan', '18': 'Kelantan',
                '20': 'Terengganu', '21': 'Terengganu', '22': 'Terengganu', '23': 'Terengganu', '24': 'Terengganu',
                '25': 'Pahang', '26': 'Pahang', '27': 'Pahang', '28': 'Pahang', '39': 'Pahang', '49': 'Pahang', '69': 'Pahang',
                '30': 'Perak', '31': 'Perak', '32': 'Perak', '33': 'Perak', '34': 'Perak', '35': 'Perak', '36': 'Perak',
                '40': 'Selangor', '41': 'Selangor', '42': 'Selangor', '43': 'Selangor', '44': 'Selangor', '45': 'Selangor', '46': 'Selangor', '47': 'Selangor', '48': 'Selangor',
                '50': 'W.P. Kuala Lumpur', '51': 'W.P. Kuala Lumpur', '52': 'W.P. Kuala Lumpur', '53': 'W.P. Kuala Lumpur', '54': 'W.P. Kuala Lumpur', '55': 'W.P. Kuala Lumpur', '56': 'W.P. Kuala Lumpur', '57': 'W.P. Kuala Lumpur', '58': 'W.P. Kuala Lumpur', '59': 'W.P. Kuala Lumpur',
                '60': 'W.P. Kuala Lumpur', '62': 'W.P. Putrajaya', '63': 'Selangor', '64': 'Selangor', '68': 'Selangor',
                '70': 'Negeri Sembilan', '71': 'Negeri Sembilan', '72': 'Negeri Sembilan', '73': 'Negeri Sembilan',
                '75': 'Melaka', '76': 'Melaka', '77': 'Melaka', '78': 'Melaka',
                '79': 'Johor', '80': 'Johor', '81': 'Johor', '82': 'Johor', '83': 'Johor', '84': 'Johor', '85': 'Johor', '86': 'Johor',
                '87': 'W.P. Labuan',
                '88': 'Sabah', '89': 'Sabah', '90': 'Sabah', '91': 'Sabah',
                '93': 'Sarawak', '94': 'Sarawak', '95': 'Sarawak', '96': 'Sarawak', '97': 'Sarawak', '98': 'Sarawak'
             };
             if (stateMap[prefix]) {
                 updates.negeri = stateMap[prefix].toUpperCase();
             }
         }

         if (name === 'ic' && typeof value === 'string') {
             const cleanIC = value.replace(/\\D/g, '');
             if (cleanIC.length >= 6) {
                 const yy = parseInt(cleanIC.substring(0, 2), 10);
                 const mm = cleanIC.substring(2, 4);
                 const dd = cleanIC.substring(4, 6);
                 if (!isNaN(yy) && parseInt(mm) > 0 && parseInt(mm) <= 12 && parseInt(dd) > 0 && parseInt(dd) <= 31) {
                    const year = yy > 50 ? 1900 + yy : 2000 + yy;
                    updates.tarikhLahir = \`\${year}-\${mm}-\${dd}\`;
                 }
             }
             if (cleanIC.length >= 8) {
                 const stateCode = cleanIC.substring(6, 8);
                 const codeMap: Record<string, string> = {
                    '01': 'Johor', '21': 'Johor', '22': 'Johor', '23': 'Johor', '24': 'Johor',
                    '02': 'Kedah', '25': 'Kedah', '26': 'Kedah', '27': 'Kedah',
                    '03': 'Kelantan', '28': 'Kelantan', '29': 'Kelantan',
                    '04': 'Melaka', '30': 'Melaka',
                    '05': 'Negeri Sembilan', '31': 'Negeri Sembilan', '59': 'Negeri Sembilan',
                    '06': 'Pahang', '32': 'Pahang', '33': 'Pahang',
                    '07': 'Pulau Pinang', '34': 'Pulau Pinang', '35': 'Pulau Pinang',
                    '08': 'Perak', '36': 'Perak', '37': 'Perak', '38': 'Perak', '39': 'Perak',
                    '09': 'Perlis', '40': 'Perlis',
                    '10': 'Selangor', '41': 'Selangor', '42': 'Selangor', '43': 'Selangor', '44': 'Selangor',
                    '11': 'Terengganu', '45': 'Terengganu', '46': 'Terengganu',
                    '12': 'Sabah', '47': 'Sabah', '48': 'Sabah', '49': 'Sabah',
                    '13': 'Sarawak', '50': 'Sarawak', '51': 'Sarawak', '52': 'Sarawak', '53': 'Sarawak',
                    '14': 'W.P. Kuala Lumpur', '54': 'W.P. Kuala Lumpur', '55': 'W.P. Kuala Lumpur', '56': 'W.P. Kuala Lumpur', '57': 'W.P. Kuala Lumpur',
                    '15': 'W.P. Labuan', '58': 'W.P. Labuan',
                    '16': 'W.P. Putrajaya'
                 };
                 const stateName = codeMap[stateCode];
                 if (stateName) {
                     updates.negeri = stateName.toUpperCase();
                 }
             }
             if (cleanIC.length === 12) {
                 const lastDigit = parseInt(cleanIC.substring(11, 12), 10);
                 if (!isNaN(lastDigit)) {
                     updates.jantina = lastDigit % 2 === 0 ? 'PEREMPUAN' : 'LELAKI';
                 }
             }
         }
         return { ...prev, ...updates };
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isNested?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Saiz fail melebihi had 2MB. Sila kecilkan gambar.');
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isNested) {
           setFormData(prev => ({
             ...prev,
             [isNested]: {
               ...(prev as any)[isNested] || {},
               [fieldName]: base64String
             }
           }));
        } else {
           setFormData(prev => ({
             ...prev,
             [fieldName]: base64String
           }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const copyAddressToBapa = () => {
    setFormData(prev => ({
      ...prev, alamatBapa1: prev.alamat1 || '', alamatBapa2: prev.alamat2 || '', poskodBapa: prev.poskod || '', daerahBapa: prev.daerah || '', negeriBapa: prev.negeri || ''
    }));
  };

  const copyAddressToIbu = () => {
    setFormData(prev => ({
      ...prev, alamatIbu1: prev.alamat1 || '', alamatIbu2: prev.alamat2 || '', poskodIbu: prev.poskod || '', daerahIbu: prev.daerah || '', negeriIbu: prev.negeri || ''
    }));
  };

  const [tiadaBapa, setTiadaBapa] = useState(false);
  const handleTiadaBapa = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTiadaBapa(checked);
    if(checked) {
       setFormData(prev => ({ ...prev, namaBapa: 'TIADA MAKLUMAT', icBapa: '-', warganegaraBapa: '-', alamatBapa1: '-', alamatBapa2: '-', poskodBapa: '-', daerahBapa: '-', negeriBapa: '-', pekerjaanBapa: '-', telefonBapa: '-' }));
    } else {
       setFormData(prev => ({ ...prev, namaBapa: '', icBapa: '', warganegaraBapa: '', alamatBapa1: '', alamatBapa2: '', poskodBapa: '', daerahBapa: '', negeriBapa: '', pekerjaanBapa: '', telefonBapa: '' }));
    }
  };

  const [tiadaIbu, setTiadaIbu] = useState(false);
  const handleTiadaIbu = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setTiadaIbu(checked);
    if(checked) {
       setFormData(prev => ({ ...prev, namaIbu: 'TIADA MAKLUMAT', icIbu: '-', warganegaraIbu: '-', alamatIbu1: '-', alamatIbu2: '-', poskodIbu: '-', daerahIbu: '-', negeriIbu: '-', pekerjaanIbu: '-', telefonIbu: '-' }));
    } else {
       setFormData(prev => ({ ...prev, namaIbu: '', icIbu: '', warganegaraIbu: '', alamatIbu1: '', alamatIbu2: '', poskodIbu: '', daerahIbu: '', negeriIbu: '', pekerjaanIbu: '', telefonIbu: '' }));
    }
  };

  const getMissingFields = () => {
    const req = ['name', 'ic', 'tarikhLahir', 'tempatLahir', 'jantina', 'alamat1', 'poskod', 'daerah', 'negeri', 'namaSekolahRendah', 'namaBapa', 'icBapa', 'pekerjaanBapa', 'telefonBapa', 'namaIbu', 'icIbu', 'pekerjaanIbu', 'telefonIbu'];
    return req.filter(f => !formData[f as keyof Candidate]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { alert('Sila sahkan perakuan.'); return; }
    
    setIsSubmitting(true);
    try {
      const permohonanId = Math.random().toString(36).substr(2, 9);
      const newCandidate: Candidate = {
        ...(formData as Candidate),
        id: permohonanId,
        statusTemuduga: 'MENUNGGU',
        statusTawaran: 'MENUNGGU'
      };
      
      saveCandidate(newCandidate);
      
      const sheetData = new URLSearchParams();
      sheetData.append('ID', newCandidate.id);
      sheetData.append('Tarikh', new Date().toISOString());
      sheetData.append('Nama', toTitleCase(newCandidate.name || ''));
      sheetData.append('IC', newCandidate.ic || '');
      sheetData.append('NoSijilLahir', newCandidate.noSijilLahir || '');
      sheetData.append('TarikhLahir', newCandidate.tarikhLahir || '');
      sheetData.append('TempatLahir', toTitleCase(newCandidate.tempatLahir || ''));
      sheetData.append('Jantina', newCandidate.jantina || '');
      sheetData.append('Alamat1', toTitleCase(newCandidate.alamat1 || ''));
      sheetData.append('Alamat2', toTitleCase(newCandidate.alamat2 || ''));
      sheetData.append('Poskod', newCandidate.poskod || '');
      sheetData.append('Daerah', toTitleCase(newCandidate.daerah || ''));
      sheetData.append('Negeri', newCandidate.negeri || '');
      sheetData.append('NamaSekolahRendah', toTitleCase(newCandidate.namaSekolahRendah || ''));
            
      sheetData.append('NamaBapa', toTitleCase(newCandidate.namaBapa || ''));
      sheetData.append('ICBapa', newCandidate.icBapa || '');
      sheetData.append('PekerjaanBapa', toTitleCase(newCandidate.pekerjaanBapa || ''));
      sheetData.append('TelefonBapa', newCandidate.telefonBapa || '');
            
      sheetData.append('NamaIbu', toTitleCase(newCandidate.namaIbu || ''));
      sheetData.append('ICIbu', newCandidate.icIbu || '');
      sheetData.append('PekerjaanIbu', toTitleCase(newCandidate.pekerjaanIbu || ''));
      sheetData.append('TelefonIbu', newCandidate.telefonIbu || '');

      sheetData.append('PBD_BM', newCandidate.pbd?.bm || '');
      sheetData.append('PBD_BI', newCandidate.pbd?.bi || '');
      sheetData.append('PBD_Math', newCandidate.pbd?.matematik || '');
      sheetData.append('PBD_Sains', newCandidate.pbd?.sains || '');
      
      sheetData.append('PBD_D6_BM', newCandidate.pbdD6?.bm || '');
      sheetData.append('PBD_D6_BI', newCandidate.pbdD6?.bi || '');
      sheetData.append('PBD_D6_Math', newCandidate.pbdD6?.matematik || '');
      sheetData.append('PBD_D6_Sains', newCandidate.pbdD6?.sains || '');

      sheetData.append('UPKK_AlQuran', newCandidate.upkk?.alquran || '');
      sheetData.append('UPKK_Akidah', newCandidate.upkk?.akidah || '');
      sheetData.append('UPKK_Sirah', newCandidate.upkk?.sirah || '');
      sheetData.append('UPKK_Adab', newCandidate.upkk?.adab || '');
      sheetData.append('UPKK_JawiKhat', newCandidate.upkk?.jawikhat || '');
      sheetData.append('UPKK_BahasaArab', newCandidate.upkk?.bahasaarab || '');
      sheetData.append('UPKK_Ibadah', newCandidate.upkk?.ibadah || '');
      sheetData.append('URL_Gambar_Calon', newCandidate.gambarUrl || '');
      sheetData.append('URL_Slip_PBD', newCandidate.pbd?.slipUrl || '');
      sheetData.append('URL_Slip_PBD_D6', newCandidate.pbdD6?.slipUrl || '');
      sheetData.append('URL_Slip_UPKK', newCandidate.upkk?.slipUrl || '');

      await fetch('https://script.google.com/macros/s/AKfycby9c8Gq0S4hMftdBUJPmiuJJreGIkg2BDAs58ZXgWefre_vsRWV4IqxGBI_5rzJGpRl/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: sheetData
      });

      setSubmitted(true);
      localStorage.removeItem('borang_draft');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terdapat ralat semasa menghantar borang. Borang direkodkan dalam sistem.');
      setSubmitted(true);
      localStorage.removeItem('borang_draft');
    } finally {
      setIsSubmitting(false);
    }
  };
`;

code = code.replace("  const handleSaveDraft = async () => {\n      if (false) { // Skip the original check since we handled it", missingFuncs + "\n\n  const handleSaveDraft = async () => {\n      if (false) {");

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
