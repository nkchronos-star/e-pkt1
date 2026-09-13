import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# 1. Update useState default for filter
content = re.sub(
    r"const \[filter, setFilter\] = useState\('ALL'\);",
    r"const [filter, setFilter] = useState('LAYAK_TEMUDUGA');",
    content
)

# 2. Update the dropdown options
old_select_block = """           <option value="ALL">Semua Calon</option>
           <option value="LAYAK_TEMUDUGA">Layak Temuduga</option>
           <option value="BERJAYA">Tawaran Berjaya</option>
           <option value="GAGAL">Tawaran Gagal</option>
           <option value="TERIMA">Terima Tawaran</option>
           <option value="TOLAK">Tolak Tawaran</option>"""

new_select_block = """           <option value="LAYAK_TEMUDUGA">Semua Calon Temuduga</option>
           <option value="BERJAYA">Ditawarkan</option>
           <option value="GAGAL">Tidak Berjaya</option>
           <option value="TOLAK">Tolak Tawaran</option>"""

content = content.replace(old_select_block, new_select_block)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
