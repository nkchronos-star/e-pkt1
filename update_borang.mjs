import fs from 'fs';

let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// 1. Fix Imports
code = code.replace(/import { FileText.*lucide-react';\nimport { Candidate } from '..\/..\/types';\nimport { db, auth, handleFirestoreError, OperationType } from '..\/..\/lib\/firebase';\nimport { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase\/firestore';/, `import { FileText, Save, Send, AlertCircle, Calendar, CheckCircle, X, LogIn } from 'lucide-react';
import { Candidate } from '../../types';
import { signInWithGoogle } from '../../lib/auth';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';`);

// Fallback if the first replace missed (if the imports look different)
if (!code.includes('signInWithGoogle')) {
  code = code.replace("import { FileText, Save, Send, AlertCircle, Calendar, CheckCircle, X } from 'lucide-react';", "import { FileText, Save, Send, AlertCircle, Calendar, CheckCircle, X, LogIn } from 'lucide-react';");
  code = code.replace("import { Candidate } from '../../types';", "import { Candidate } from '../../types';\nimport { signInWithGoogle } from '../../lib/auth';\nimport { db, handleFirestoreError, OperationType } from '../../lib/firebase';\nimport { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';");
}

// 2. Extract context
code = code.replace('const { settings, saveCandidate } = useAppContext();', 'const { settings, saveCandidate, firebaseUser } = useAppContext();');

// 3. Insert Draft Loading
const draftLogic = `  // Load Draft from Firebase
  useEffect(() => {
    const loadDraft = async () => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'permohonan', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
             const data = docSnap.data();
             if (data.candidateData) {
                setFormData(data.candidateData);
                if (data.status === 'submitted') {
                   setSubmitted(true);
                }
             }
          }
        } catch (e) {
          console.error('Failed to load draft from Firebase', e);
        }
      }
    };
    loadDraft();
  }, [firebaseUser]);
`;

code = code.replace('const [isSubmitting, setIsSubmitting] = useState(false);', 'const [isSubmitting, setIsSubmitting] = useState(false);\n' + draftLogic);

// 4. Update handleSubmit
const newSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = getMissingFields();
    if (missing.length > 0) {
      alert("Sila lengkapkan ruangan berikut:\\n\\n" + missing.map(m => "- " + m).join("\\n"));
      return;
    }

    if (!firebaseUser) {
       alert('Sila log masuk terlebih dahulu untuk menghantar permohonan.');
       return;
    }

    setIsSubmitting(true);

    const newCandidate = {
      ...(formData as Candidate),
      id: firebaseUser.uid,
      statusBorang: 'LENGKAP',
      statusTemuduga: 'MENUNGGU',
      statusTawaran: 'DALAM_PERTIMBANGAN',
    };

    try {
      const docRef = doc(db, 'permohonan', firebaseUser.uid);
      const existingDoc = await getDoc(docRef);
      
      const payload = {
         userId: firebaseUser.uid,
         status: 'submitted',
         studentName: newCandidate.name || 'Calon',
         icNumber: newCandidate.ic || '000000000000',
         candidateData: newCandidate,
         updatedAt: serverTimestamp(),
      };
      
      if (!existingDoc.exists()) {
         Object.assign(payload, { createdAt: serverTimestamp() });
      } else {
         Object.assign(payload, { createdAt: existingDoc.data().createdAt });
      }

      await setDoc(docRef, payload);
      
      saveCandidate(newCandidate as Candidate); // Fallback for UI state
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (e) {
      console.error(e);
      try {
        handleFirestoreError(e, OperationType.WRITE, 'permohonan/' + firebaseUser.uid);
      } catch (err) {
        // Ignored
      }
      alert('Gagal menghantar permohonan. Sila cuba lagi.\\n\\nRalat: ' + (e instanceof Error ? e.message : ''));
    } finally {
      setIsSubmitting(false);
    }
  };`;

// Use regex to replace the old handleSubmit
code = code.replace(/const handleSubmit = async[\s\S]*?setIsSubmitting\(false\);\n  \};/, newSubmit);


// 5. Auth gate
const authScreen = `if (!firebaseUser) {
    return (
      <div className="animate-in fade-in duration-500 max-w-xl mx-auto mt-12">
         <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 p-10 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <FileText className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Akses Borang Permohonan</h2>
            <p className="text-slate-600 mb-8">Sila log masuk menggunakan akaun Google anda untuk mula mengisi borang permohonan kemasukan ke tingkatan 1.</p>
            <button onClick={signInWithGoogle} className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
               <LogIn className="w-5 h-5" />
               Log Masuk dengan Google
            </button>
         </div>
      </div>
    );
  }

  if (!isBuka) {`;

code = code.replace('if (!isBuka) {', authScreen);

// 6. Update handleSaveDraft
const saveDraftFn = `const handleSaveDraft = async () => {
    if (!firebaseUser) return;
    try {
      const docRef = doc(db, 'permohonan', firebaseUser.uid);
      const existingDoc = await getDoc(docRef);
      
      const payload = {
         userId: firebaseUser.uid,
         status: 'draft',
         studentName: formData.name || 'Calon',
         icNumber: formData.ic || '000000000000',
         candidateData: formData,
         updatedAt: serverTimestamp(),
      };
      
      if (!existingDoc.exists()) {
         Object.assign(payload, { createdAt: serverTimestamp() });
      } else {
         Object.assign(payload, { createdAt: existingDoc.data().createdAt });
      }

      await setDoc(docRef, payload);
      setPopup({ show: true, title: 'Berjaya', message: 'Draf permohonan berjaya disimpan di awan!' });
    } catch (e) {
       console.error(e);
       setPopup({ show: true, title: 'Ralat', message: 'Gagal menyimpan draf. Sila pastikan capaian internet anda stabil.' });
    }
  };`;

code = code.replace(/const handleSaveDraft = \(\) => {[\s\S]*?setPopup\({ show: true, title: 'Berjaya', message: 'Draf permohonan berjaya disimpan!' }\);\n  };/, saveDraftFn);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
