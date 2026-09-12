import re

with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

# Fix the duplicated classes
content = re.sub(r'print:mb-\d( print:mb-\d)+', 'print:mb-1', content)
content = re.sub(r'print:mt-\d( print:mt-\d)+', 'print:mt-1', content)

# I want to ensure the letter fits completely on 1 page and looks good.
# Let's adjust padding and font sizes.
content = content.replace('p-6 sm:p-8', 'p-6')
content = content.replace('transform: scale(0.90)', 'transform: scale(0.85)')
content = content.replace('mb-3 print:mb-2', 'mb-3 print:mb-1')
content = content.replace('mb-4 print:mb-3', 'mb-4 print:mb-2')

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(content)
