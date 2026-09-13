with open('src/components/dashboard/PrintTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace('text-sm print:text-xs print:text-[10px]', 'text-sm print:text-[10px]')
content = content.replace('text-xs text-xs', 'text-xs')
content = content.replace('text-xs print:text-[10px] print:text-[10px]', 'text-xs print:text-[10px]')
content = content.replace('pt-4 print:pt-2 print:pt-4 print:pt-2', 'pt-4 print:pt-2')
content = content.replace('mt-4 print:mt-2 print:mt-2', 'mt-4 print:mt-2')
content = content.replace('text-xs print:text-xs print:text-[10px]', 'text-xs print:text-[10px]')

with open('src/components/dashboard/PrintTemplate.tsx', 'w') as f:
    f.write(content)
