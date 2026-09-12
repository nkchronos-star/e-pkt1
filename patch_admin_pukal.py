import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Add import
import_statement = "import { BorangPukalCetakPDF } from './BorangPukalCetakPDF';\n"
content = re.sub(r"import \{ BorangCetakPDF \} from '\./BorangCetakPDF';", "import { BorangCetakPDF } from './BorangCetakPDF';\n" + import_statement, content)

# Add state
state_statement = "  const [printPukalBorang, setPrintPukalBorang] = useState<boolean>(false);\n"
content = re.sub(r"  const \[printCandidate, setPrintCandidate\] = useState<Candidate \| null>\(null\);", "  const [printCandidate, setPrintCandidate] = useState<Candidate | null>(null);\n" + state_statement, content)

# Add button
old_button = """                <button 
                  onClick={() => {
                    const headers = ["""

new_button = """                <button 
                  onClick={() => setPrintPukalBorang(true)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Borang Pukal
                </button>
                <button 
                  onClick={() => {"""
content = content.replace(old_button, new_button)

# Add modal rendering
old_render = "{printCandidate && <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />}"
new_render = "{printCandidate && <BorangCetakPDF candidate={printCandidate} onClose={() => setPrintCandidate(null)} />}\n       {printPukalBorang && <BorangPukalCetakPDF candidates={candidates} onClose={() => setPrintPukalBorang(false)} />}"
content = content.replace(old_render, new_render)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
