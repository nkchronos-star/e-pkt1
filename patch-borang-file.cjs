const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// 1. Add handleFileChange and getMissingFields
const insertAfterHandleChange = `    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };`;

const newFunctions = `    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, isNested?: string) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const getMissingFields = () => {
    const requiredFields = [
      'name', 'ic', 'noSijilLahir', 'tarikhLahir', 'tempatLahir', 'jantina', 'alamat1', 'poskod', 'daerah', 'negeri', 'namaSekolahRendah',
      'namaBapa', 'icBapa', 'warganegaraBapa', 'alamatBapa1', 'poskodBapa', 'daerahBapa', 'negeriBapa', 'pekerjaanBapa', 'telefonBapa',
      'namaIbu', 'icIbu', 'warganegaraIbu', 'alamatIbu1', 'poskodIbu', 'daerahIbu', 'negeriIbu', 'pekerjaanIbu', 'telefonIbu'
    ];
    let missing = [];
    for (const field of requiredFields) {
      if (!formData[field as keyof Candidate]) missing.push(field);
    }
    if (!formData.pbd?.bm || !formData.pbd?.bi || !formData.pbd?.matematik || !formData.pbd?.sains) missing.push("Keputusan PBD Darjah 5");
    if (!formData.pbdD6?.bm || !formData.pbdD6?.bi || !formData.pbdD6?.matematik || !formData.pbdD6?.sains) missing.push("Keputusan PBD Darjah 6");
    
    const upkkKeys = ['alquran', 'akidah', 'sirah', 'adab', 'jawikhat', 'bahasaarab', 'ibadah', 'penghayatancarahidupislam', 'amalisolat'];
    for(const key of upkkKeys) {
        if(!(formData.upkk as any)?.[key]) missing.push("UPKK " + key);
    }
    if (!agreed) missing.push("Pengesahan (Tick Box)");
    return missing;
  };
`;
code = code.replace(insertAfterHandleChange, newFunctions);

// 2. Fix the passport image upload
const passportUploadMatch = `              <div className="flex-1 w-full text-center sm:text-left">
                <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                <p className="mt-3 text-sm text-slate-400 font-medium">Format: JPG, PNG. Saiz maks: 2MB.</p>
              </div>`;

const passportUploadReplace = `              <div className="flex-1 w-full text-center sm:text-left">
                {formData.gambarUrl && (
                   <img src={formData.gambarUrl} alt="Passport" className="w-24 h-32 object-cover rounded-xl mb-4 border-2 border-slate-200 mx-auto sm:mx-0" />
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambarUrl')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                <p className="mt-3 text-sm text-slate-400 font-medium">Format: JPG, PNG. Saiz maks: 2MB.</p>
              </div>`;
code = code.replace(passportUploadMatch, passportUploadReplace);

// 3. Add slip upload for PBD 5
const pbd5EndMatch = `                 ))}
              </div>
              <h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">b. Keputusan PBD (Pertengahan Tahun Darjah 6)</h3>`;

const pbd5EndReplace = `                 ))}
              </div>
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-center mb-10 flex flex-col items-center justify-center">
                 {formData.pbd?.slipUrl && (
                   <img src={formData.pbd?.slipUrl} alt="Slip PBD 5" className="max-h-40 object-contain rounded-xl mb-4" />
                 )}
                 <label className="text-sm font-bold text-slate-700 block mb-2">Muat Naik Slip PBD (Akhir Darjah 5)</label>
                 <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'slipUrl', 'pbd')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 cursor-pointer" />
              </div>

              <h3 className="font-extrabold text-slate-800 mb-6 bg-slate-100/50 p-4 rounded-xl border border-slate-200/60 uppercase tracking-widest text-sm">b. Keputusan PBD (Pertengahan Tahun Darjah 6)</h3>`;
code = code.replace(pbd5EndMatch, pbd5EndReplace);

// 4. Update slip upload for PBD 6
const pbd6UploadMatch = `              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-center">
                 <input type="file" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 cursor-pointer" />
              </div>`;

const pbd6UploadReplace = `              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center">
                 {formData.pbdD6?.slipUrl && (
                   <img src={formData.pbdD6?.slipUrl} alt="Slip PBD 6" className="max-h-40 object-contain rounded-xl mb-4" />
                 )}
                 <label className="text-sm font-bold text-slate-700 block mb-2">Muat Naik Slip PBD (Pertengahan Darjah 6)</label>
                 <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'slipUrl', 'pbdD6')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 cursor-pointer" />
              </div>`;
code = code.replace(pbd6UploadMatch, pbd6UploadReplace);

// 5. Update slip upload for UPKK
const upkkUploadMatch = `              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-center">
                 <input type="file" className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 cursor-pointer" />
              </div>`;

const upkkUploadReplace = `              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 text-center flex flex-col items-center justify-center">
                 {formData.upkk?.slipUrl && (
                   <img src={formData.upkk?.slipUrl} alt="Slip UPKK" className="max-h-40 object-contain rounded-xl mb-4" />
                 )}
                 <label className="text-sm font-bold text-slate-700 block mb-2">Muat Naik Slip Keputusan UPKK</label>
                 <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, 'slipUrl', 'upkk')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 cursor-pointer" />
              </div>`;
code = code.replace(upkkUploadMatch, upkkUploadReplace);

// 6. Update handleSubmit alert to show exactly what's missing
const submitAlertMatch = `    if (!isFormComplete()) {
      alert("Sila lengkapkan semua ruangan sebelum menghantar.");
      return;
    }`;

const submitAlertReplace = `    const missing = getMissingFields();
    if (missing.length > 0) {
      alert("Sila lengkapkan ruangan berikut:\\n\\n" + missing.map(m => "- " + m).join("\\n"));
      return;
    }`;
code = code.replace(submitAlertMatch, submitAlertReplace);

// 7. Change the conditional render for the submit button
const buttonConditionMatch = `           {isFormComplete() ? (
              <button 
                type="submit"`;
const buttonConditionReplace = `           {getMissingFields().length === 0 ? (
              <button 
                type="submit"`;
code = code.replace(buttonConditionMatch, buttonConditionReplace);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Borang.tsx successfully.");
