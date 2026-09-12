import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

old_sync = """  const syncSettingsToServer = () => {
    // Left for compatibility, though realtime listener handles this.
    alert('Sistem kini menggunakan storan Firebase. Semua perubahan disimpan secara automatik!');
  };"""

new_sync = """  const syncSettingsToServer = async () => {
    try {
      await setDoc(doc(db, 'config', 'main'), state.settings);
      alert('Telah Berjaya! Semua Tetapan Sistem Berjaya Disimpan ke dalam Pangkalan Data.');
    } catch (e) {
      console.error("Ralat menyimpan tetapan:", e);
      alert('Ralat! Tetapan tidak berjaya disimpan.');
    }
  };"""

content = content.replace(old_sync, new_sync)

with open('src/store.tsx', 'w') as f:
    f.write(content)

