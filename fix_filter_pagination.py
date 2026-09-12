import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Replace setFilter(e.target.value) with something that also resets page
content = content.replace("onChange={(e) => setFilter(e.target.value)}", "onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}")

# For the SuperAdminView tab, resetting page when tab changes:
content = content.replace("onClick={() => setActiveTab('PERMOHONAN')}", "onClick={() => { setActiveTab('PERMOHONAN'); setCurrentPage(1); }}")
content = content.replace("onClick={() => setActiveTab('KAWALAN')}", "onClick={() => setActiveTab('KAWALAN')}")
content = content.replace("onClick={() => setActiveTab('PENGGUNA')}", "onClick={() => setActiveTab('PENGGUNA')}")
content = content.replace("onClick={() => setActiveTab('MARKAH')}", "onClick={() => setActiveTab('MARKAH')}")

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
