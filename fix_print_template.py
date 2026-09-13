with open('src/components/dashboard/PrintTemplate.tsx', 'r') as f:
    content = f.read()

# Make the header text slightly smaller in print to save more space vertically
content = content.replace('text-2xl print:text-xl font-extrabold', 'text-2xl print:text-lg font-extrabold')
content = content.replace('pb-4 mb-6 print:mb-3', 'pb-4 print:pb-2 mb-6 print:mb-3')

# Decrease padding more
content = content.replace('p-4 sm:p-8 print:p-0', 'p-4 sm:p-8 print:pt-0 print:px-2 print:pb-0')

with open('src/components/dashboard/PrintTemplate.tsx', 'w') as f:
    f.write(content)
