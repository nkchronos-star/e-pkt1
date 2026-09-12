import re

with open('src/components/dashboard/Utama.tsx', 'r') as f:
    content = f.read()

content = content.replace("https://www.youtube.com/embed/HrysVVSgNYs?si=HrysVVSgNYs", "https://www.youtube.com/embed/JT6Py5iXp1g?si=VRrKskCawUxW1W1B")

with open('src/components/dashboard/Utama.tsx', 'w') as f:
    f.write(content)
