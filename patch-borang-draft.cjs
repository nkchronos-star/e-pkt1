const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetButtons = `           {agreed && getMissingFields().length === 0 ? (
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={\`\${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-600/30 shadow-xl'} text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 text-lg\`}
              >
                 {isSubmitting ? (
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Send className="w-6 h-6" />
                 )}
                 {isSubmitting ? 'Menghantar...' : 'Hantar Permohonan'}
              </button>
           ) : (`;

const replaceButtons = `           <div className="flex gap-4">
              <button 
                type="button"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className={\`\${isSavingDraft ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] shadow-slate-900/30 shadow-xl'} text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 text-lg\`}
              >
                 {isSavingDraft ? (
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Save className="w-6 h-6" />
                 )}
                 Simpan Draf
              </button>
           
           {agreed && getMissingFields().length === 0 ? (
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={\`\${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-600/30 shadow-xl'} text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 text-lg\`}
              >
                 {isSubmitting ? (
                   <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <Send className="w-6 h-6" />
                 )}
                 {isSubmitting ? 'Menghantar...' : 'Hantar Permohonan'}
              </button>
           ) : (`;

// We also need to add isSavingDraft state and handleSaveDraft function
const targetState = `  const [isSubmitting, setIsSubmitting] = useState(false);`;
const replaceState = `  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const handleSaveDraft = async () => {
    if (!firebaseUser) {
      alert("Anda perlu log masuk untuk menyimpan draf ke awan.");
      return;
    }
    setIsSavingDraft(true);
    try {
      const draftData = JSON.parse(JSON.stringify(formData));
      if (draftData.gambarUrl && draftData.gambarUrl.length > 500000) draftData.gambarUrl = ''; 
      if (draftData.pbd && draftData.pbd.slipUrl && draftData.pbd.slipUrl.length > 500000) draftData.pbd.slipUrl = '';
      if (draftData.pbdD6 && draftData.pbdD6.slipUrl && draftData.pbdD6.slipUrl.length > 500000) draftData.pbdD6.slipUrl = '';
      if (draftData.upkk && draftData.upkk.slipUrl && draftData.upkk.slipUrl.length > 500000) draftData.upkk.slipUrl = '';

      await setDoc(doc(db, 'permohonan', firebaseUser.uid), {
        userId: firebaseUser.uid,
        status: 'draft',
        studentName: draftData.name || 'Draf Tiada Nama',
        icNumber: draftData.ic || 'Tiada IC',
        candidateData: draftData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      alert("Draf berjaya disimpan ke awan. Anda boleh menyambung isian pada bila-bila masa dengan log masuk menggunakan emel yang sama.");
    } catch (e: any) {
      alert("Gagal menyimpan draf: " + e.message);
    } finally {
      setIsSavingDraft(true); // Wait, should be false! Let's fix below.
      setTimeout(() => setIsSavingDraft(false), 500);
    }
  };`;

code = code.replace(targetButtons, replaceButtons);
// Also close the div after the error message block
code = code.replace(`           )}
        </div>

      </form>`, `           )}
           </div>
        </div>

      </form>`);

code = code.replace(targetState, replaceState);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Borang.tsx with Save Draft");
