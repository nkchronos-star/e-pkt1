import re

with open('src/store.tsx', 'r') as f:
    content = f.read()

# Force state to update locally instantly when typing/changing settings, then the save button will sync it
old_update = """  const updateSettings = async (newSettings: Partial<ApplicationSettings>) => {
    try {
      await updateDoc(doc(db, 'config', 'main'), newSettings);
    } catch (e) {
      console.error("Error updating settings:", e);
    }
  };"""

new_update = """  const updateSettings = async (newSettings: Partial<ApplicationSettings>) => {
    // 1. Update React state immediately so UI feels responsive
    setState(prev => {
        const updatedSettings = { ...prev.settings, ...newSettings };
        
        // 2. Also try to push to Firebase in background to be safe
        updateDoc(doc(db, 'config', 'main'), newSettings).catch(e => {
            console.error("Firebase background sync failed:", e);
        });
        
        return { ...prev, settings: updatedSettings };
    });
  };"""

content = content.replace(old_update, new_update)

with open('src/store.tsx', 'w') as f:
    f.write(content)

