import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Make saveCandidate return the promise so caller can await it, and scrub undefined.
save_func_old = """  const saveCandidate = async (candidate: Candidate) => {
    try {
      await setDoc(doc(db, 'candidates', candidate.ic), candidate);
    } catch (e) {
      console.error("Error saving candidate:", e);
      alert('Ralat menyimpan data permohonan.');
    }
  };"""

save_func_new = """  const saveCandidate = async (candidate: Candidate) => {
    try {
      const cleanData = JSON.parse(JSON.stringify(candidate));
      // Remove any slashes from IC if used as document ID
      const safeId = String(cleanData.ic || cleanData.id).replace(/[^a-zA-Z0-9_-]/g, '');
      await setDoc(doc(db, 'candidates', safeId), cleanData);
    } catch (e) {
      console.error("Error saving candidate:", e);
      alert('Ralat menyimpan data permohonan: ' + (e as any).message);
      throw e;
    }
  };"""

content = content.replace(save_func_old, save_func_new)

with open('src/store.tsx', 'w') as f:
    f.write(content)

with open('src/components/dashboard/Borang.tsx', 'r') as f:
    borang_content = f.read()

borang_save_old = """      saveCandidate(newCandidate);
      
      setSubmitted(true);"""
      
borang_save_new = """      await saveCandidate(newCandidate);
      
      setSubmitted(true);"""

borang_content = borang_content.replace(borang_save_old, borang_save_new)

with open('src/components/dashboard/Borang.tsx', 'w') as f:
    f.write(borang_content)

