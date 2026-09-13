with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    lines = f.readlines()

out = []
for i, line in enumerate(lines):
    out.append(line)
    if "title=\"Cetak Maklumat Pemohon\"" in line:
        # Next line is ">", then "<FileText ...", then "</button>"
        pass
    if "FileText className" in lines[i-2] and "</button>" in lines[i-1] and "<button" in line and "onClick={() => {" in lines[i+1]:
        # This is the start of the delete button, we insert the edit button BEFORE this line!
        out.pop() # remove the <button line we just added
        
        out.append('    <button\n')
        out.append('      onClick={() => setEditCandidate(c)}\n')
        out.append('      className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg"\n')
        out.append('      title="Kemaskini Maklumat"\n')
        out.append('    >\n')
        out.append('      <Edit className="w-5 h-5" />\n')
        out.append('    </button>\n')
        
        out.append(line) # add back the <button line for delete

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.writelines(out)
