const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// 1. Fix Image Upload UI
const oldGambarMatch = `           <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-32 h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 group hover:border-emerald-400 hover:bg-slate-50 transition-colors">
                 <FileText className="w-8 h-8 mb-2 group-hover:text-emerald-500 transition-colors" />
                 <span className="text-xs font-medium">Gambar</span>
              </div>
              <div className="flex-1 w-full text-center sm:text-left">
                {formData.gambarUrl && (
                   <img src={formData.gambarUrl} alt="Passport" className="w-24 h-32 object-cover rounded-xl mb-4 border-2 border-slate-200 mx-auto sm:mx-0" />
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambarUrl')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                <p className="mt-3 text-sm text-slate-400 font-medium">Format: JPG, PNG. Saiz maks: 2MB.</p>
              </div>
           </div>`;

const newGambarReplace = `           <div className="flex flex-col sm:flex-row items-center gap-8">
              {!formData.gambarUrl && (
                 <div className="w-32 h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 group hover:border-emerald-400 hover:bg-slate-50 transition-colors">
                    <FileText className="w-8 h-8 mb-2 group-hover:text-emerald-500 transition-colors" />
                    <span className="text-xs font-medium">Gambar</span>
                 </div>
              )}
              {formData.gambarUrl && (
                 <img src={formData.gambarUrl} alt="Passport" className="w-32 h-40 object-cover rounded-2xl border-2 border-slate-200" />
              )}
              <div className="flex-1 w-full text-center sm:text-left">
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'gambarUrl')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-50 file:text-emerald-600 hover:file:bg-emerald-100 transition-colors cursor-pointer" />
                <p className="mt-3 text-sm text-slate-400 font-medium">Format: JPG, PNG. Saiz maks: 2MB.</p>
              </div>
           </div>`;

if(code.includes(oldGambarMatch)) {
  code = code.replace(oldGambarMatch, newGambarReplace);
  console.log("Patched Gambar UI");
}

// 2. Change handleChange for IC parsing
const oldHandleChange = `    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };`;

const newHandleChange = `    } else {
      setFormData(prev => {
         let updates: any = { [name]: value };
         if (name === 'ic' && value) {
             const cleanIC = value.replace(/\\D/g, '');
             if (cleanIC.length >= 8 && (!prev.tempatLahir || !prev.negeri)) {
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
                     if(!prev.tempatLahir) updates.tempatLahir = stateName;
                     if(!prev.negeri) updates.negeri = stateName;
                 }
             }
         }
         return { ...prev, ...updates };
      });
    }
  };`;

if(code.includes(oldHandleChange)) {
  code = code.replace(oldHandleChange, newHandleChange);
  console.log("Patched IC HandleChange");
}

// 3. Make Negeri a dropdown
const stateOptions = `                  <option value="">-- Pilih Negeri --</option>
                  <option value="Johor">Johor</option>
                  <option value="Kedah">Kedah</option>
                  <option value="Kelantan">Kelantan</option>
                  <option value="Melaka">Melaka</option>
                  <option value="Negeri Sembilan">Negeri Sembilan</option>
                  <option value="Pahang">Pahang</option>
                  <option value="Pulau Pinang">Pulau Pinang</option>
                  <option value="Perak">Perak</option>
                  <option value="Perlis">Perlis</option>
                  <option value="Selangor">Selangor</option>
                  <option value="Terengganu">Terengganu</option>
                  <option value="Sabah">Sabah</option>
                  <option value="Sarawak">Sarawak</option>
                  <option value="W.P. Kuala Lumpur">W.P. Kuala Lumpur</option>
                  <option value="W.P. Labuan">W.P. Labuan</option>
                  <option value="W.P. Putrajaya">W.P. Putrajaya</option>`;

const oldNegeriPemohon = `<input type="text" name="negeri" value={formData.negeri || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />`;
const newNegeriPemohon = `<select name="negeri" value={formData.negeri || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none" required>
${stateOptions}
                  </select>`;
code = code.replace(oldNegeriPemohon, newNegeriPemohon);

const oldNegeriBapa = `<input type="text" name="negeriBapa" value={formData.negeriBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />`;
const newNegeriBapa = `<select name="negeriBapa" value={formData.negeriBapa || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none" required>
${stateOptions}
                  </select>`;
code = code.replace(oldNegeriBapa, newNegeriBapa);

const oldNegeriIbu = `<input type="text" name="negeriIbu" value={formData.negeriIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white" required />`;
const newNegeriIbu = `<select name="negeriIbu" value={formData.negeriIbu || ''} onChange={handleChange} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 uppercase focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 bg-slate-50 focus:bg-white appearance-none" required>
${stateOptions}
                  </select>`;
code = code.replace(oldNegeriIbu, newNegeriIbu);


fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
