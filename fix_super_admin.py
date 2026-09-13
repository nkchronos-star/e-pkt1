import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Locate the Action column inside SuperAdminView for Permohonan
action_buttons = """
    <button
      onClick={() => setPrintCandidate(c)}
      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
      title="Cetak Maklumat Pemohon"
    >
      <FileText className="w-5 h-5" />
    </button>
    <button
      onClick={() => setEditCandidate(c)}
      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg"
      title="Kemaskini Maklumat"
    >
      <Edit className="w-5 h-5" />
    </button>
    <button
      onClick={() => {
"""

# Replace in content
content = content.replace("""
    <button
      onClick={() => setPrintCandidate(c)}
      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
      title="Cetak Maklumat Pemohon"
    >
      <FileText className="w-5 h-5" />
    </button>
    <button
      onClick={() => {
""", action_buttons)

# Also add the modal renderer at the end of SuperAdminView
modal_render = """
      {editCandidate && (
         <EditCandidateModal 
            candidate={editCandidate} 
            onClose={() => setEditCandidate(null)} 
            onUpdated={() => {
               // Data will sync via firebase onSnapshot, but we close it here
            }}
         />
      )}
    </div>
  );
}
"""

content = re.sub(r'(\s+)</div>\s*<style dangerouslySetInnerHTML.*?\s+</div>\s*\);\s*}', r'\1</div>\n      <style dangerouslySetInnerHTML={{__html: `\n        .print\\:hidden { display: none !important; }\n      `}} />' + modal_render, content, flags=re.DOTALL)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
