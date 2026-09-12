const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetSubmit = `      // 1. Simpan ke Firebase (Cloud Database)
      const permohonanId = Math.random().toString(36).substr(2, 9);
      newCandidate.id = permohonanId;

      // Remove any undefined values which Firestore rejects
      const safeCandidateData = JSON.parse(JSON.stringify(newCandidate));
      
      await setDoc(doc(db, 'permohonan', permohonanId), {
        userId: 'public',
        status: 'draft',
        studentName: newCandidate.name || 'Tiada Nama',
        icNumber: newCandidate.ic || 'Tiada IC',
        candidateData: safeCandidateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })`;

const replaceSubmit = `      // 1. Simpan ke Firebase (Cloud Database)
      const permohonanId = firebaseUser ? firebaseUser.uid : Math.random().toString(36).substr(2, 9);
      newCandidate.id = permohonanId;

      // Remove any undefined values which Firestore rejects
      const safeCandidateData = JSON.parse(JSON.stringify(newCandidate));
      
      await setDoc(doc(db, 'permohonan', permohonanId), {
        userId: firebaseUser ? firebaseUser.uid : 'public',
        status: 'submitted',
        studentName: newCandidate.name || 'Tiada Nama',
        icNumber: newCandidate.ic || 'Tiada IC',
        candidateData: safeCandidateData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })`;

code = code.replace(targetSubmit, replaceSubmit);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Borang.tsx submit");
