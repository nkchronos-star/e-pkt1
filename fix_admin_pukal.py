with open('src/components/dashboard/AdminPanel.tsx', 'r') as f:
    content = f.read()

bad_block = """                <button 
                  onClick={() => {
                      "No", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", """

good_block = """                <button 
                  onClick={() => {
                    const headers = [
                      "No", "No. Kad Pengenalan", "Nama Calon", "Jantina", "Tarikh Lahir", "Tempat Lahir", """

content = content.replace(bad_block, good_block)

with open('src/components/dashboard/AdminPanel.tsx', 'w') as f:
    f.write(content)
