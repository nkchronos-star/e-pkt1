const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const target = `      await setDoc(doc(db, 'permohonan', permohonanId), {
        userId: 'public',
        status: 'draft',
        studentName: newCandidate.name || 'Tiada Nama',
        icNumber: newCandidate.ic || 'Tiada IC',
        candidateData: newCandidate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })`;

const replace = `      // Remove any undefined values which Firestore rejects
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

if (code.includes("userId: 'public',") && !code.includes("safeCandidateData")) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
  console.log('Patched');
} else {
  console.log('Already patched or target not found');
}
