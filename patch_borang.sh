#!/bin/bash
node -e "
const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const importStr = \"import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';\nimport { collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';\n\";
code = code.replace(\"import { Candidate } from '../../types';\", \"import { Candidate } from '../../types';\n\" + importStr);

const originalSubmit = \`
    try {
      // 1. Simpan ke sistem/local storage
      saveCandidate(newCandidate);

      // 2. Format data untuk dihantar ke Google Sheets Web App
      const sheetData = new URLSearchParams();
\`;

const newSubmit = \`
    try {
      // 1. Simpan ke Firebase (Cloud Database)
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
      }).catch(e => handleFirestoreError(e, OperationType.CREATE, 'permohonan'));

      // 2. Simpan ke Local State untuk update paparan serta merta
      saveCandidate(newCandidate);

      // 3. Format data untuk dihantar ke Google Sheets Web App (Backup)
      const sheetData = new URLSearchParams();
\`;

code = code.replace(originalSubmit, newSubmit);
fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
"
