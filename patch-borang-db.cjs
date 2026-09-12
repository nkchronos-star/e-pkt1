const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const targetFirebase = `      // 1. Simpan ke Firebase (Cloud Database)
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert('Sila log masuk dahulu untuk menghantar borang.');
        setIsSubmitting(false);
        return;
      }
      
      const permohonanId = Math.random().toString(36).substr(2, 9);
      newCandidate.id = permohonanId;

      await setDoc(doc(db, 'permohonan', permohonanId), {
        userId: userId,
        status: 'draft',
        studentName: newCandidate.name || 'Tiada Nama',
        icNumber: newCandidate.ic || 'Tiada IC',
        candidateData: newCandidate,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }).catch(e => handleFirestoreError(e, OperationType.CREATE, 'permohonan'));`;

const replaceFirebase = `      // 1. Firebase db call removed as requested
      const permohonanId = Math.random().toString(36).substr(2, 9);
      newCandidate.id = permohonanId;`;

code = code.replace(targetFirebase, replaceFirebase);

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
