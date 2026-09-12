import re

with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Since we imported Printer in patch_admin_pukal.py but it might not be in scope, let's fix the imports.
import_printer = "import { Printer } from 'lucide-react';"
if "Printer" not in content[:500]:
    content = content.replace("import { LogOut", "import { LogOut, Printer")
    with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
        f.write(content)

