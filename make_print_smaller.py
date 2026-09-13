with open('src/components/dashboard/PrintTemplate.tsx', 'r') as f:
    content = f.read()

content = content.replace('text-sm', 'text-sm print:text-xs')
content = content.replace('text-xs', 'text-xs print:text-[10px]')
# Re-adjust the specific sizes
content = content.replace('text-2xl', 'text-2xl print:text-xl')
content = content.replace('text-base', 'text-base print:text-sm')

# Make the passport image slightly smaller in print
content = content.replace('w-24 h-32', 'w-24 h-32 print:w-20 print:h-28')

# Adjust spacing more aggressively
content = content.replace('print:mb-4', 'print:mb-3')
content = content.replace('print:p-4', 'print:p-0')
content = content.replace('gap-4 sm:gap-8', 'gap-4 sm:gap-8 print:gap-4')
content = content.replace('gap-6', 'gap-6 print:gap-4')
content = content.replace('gap-y-2', 'gap-y-2 print:gap-y-1')
content = content.replace('gap-x-4', 'gap-x-4 print:gap-x-2')
content = content.replace('mt-4', 'mt-4 print:mt-2')
content = content.replace('mb-2', 'mb-2 print:mb-1')
content = content.replace('pb-2', 'pb-2 print:pb-1')
content = content.replace('pt-4', 'pt-4 print:pt-2')
content = content.replace('print:text-[10px] text-slate-400', 'text-xs text-slate-400') # don't shrink the placeholder

with open('src/components/dashboard/PrintTemplate.tsx', 'w') as f:
    f.write(content)
