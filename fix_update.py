import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

update_func_old = """  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {
    try {
      await updateDoc(doc(db, 'candidates', ic), data);
    } catch (e) {
      console.error("Error updating candidate:", e);
    }
  };"""

update_func_new = """  const updateCandidate = async (ic: string, data: Partial<Candidate>) => {
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await updateDoc(doc(db, 'candidates', safeId), cleanData);
    } catch (e) {
      console.error("Error updating candidate:", e);
    }
  };"""

content = content.replace(update_func_old, update_func_new)

delete_func_old = """  const deleteCandidate = async (ic: string) => {
    try {
      await deleteDoc(doc(db, 'candidates', ic));
    } catch (e) {
      console.error("Error deleting candidate:", e);
    }
  };"""

delete_func_new = """  const deleteCandidate = async (ic: string) => {
    try {
      const safeId = String(ic).replace(/[^a-zA-Z0-9_-]/g, '');
      await deleteDoc(doc(db, 'candidates', safeId));
    } catch (e) {
      console.error("Error deleting candidate:", e);
    }
  };"""

content = content.replace(delete_func_old, delete_func_new)

with open('src/store.tsx', 'w') as f:
    f.write(content)
