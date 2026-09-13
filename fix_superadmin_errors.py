import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Fix duplicate state
duplicate_state = """  // Pengguna State
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'TAHFIZ' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;"""

content = content.replace(duplicate_state, """  // Pengguna State
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'TAHFIZ' });""")


# Fix onClick button issue
# Around line 1097:
#                <button 
#                  onClick={() => {
#                      const headers = [

buggy_code = """                    <button 
                      onClick={() => setPrintPukalBorang(true)}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm text-sm whitespace-nowrap"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak Pukal
                    </button>
                </div>
             </div>
                <button 
                  onClick={() => {"""
                  
fixed_code = """                    <button 
                      onClick={() => setPrintPukalBorang(true)}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm text-sm whitespace-nowrap"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak Pukal
                    </button>
                    
                    <button 
                      onClick={() => {"""
content = content.replace(buggy_code, fixed_code)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
