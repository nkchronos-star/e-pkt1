#!/bin/bash
for file in src/components/dashboard/*.tsx; do
  sed -i 's/emerald-500\/20/teal-500\/20/g' "$file"
  sed -i 's/emerald-500\/30/teal-500\/30/g' "$file"
  sed -i 's/emerald-100\/50/teal-100\/50/g' "$file"
  sed -i 's/emerald-200\/60/teal-200\/60/g' "$file"
  sed -i 's/emerald-600\/30/teal-600\/30/g' "$file"
  sed -i 's/emerald-100\/30/teal-100\/30/g' "$file"
  
  sed -i 's/bg-emerald-600/bg-teal-700/g' "$file"
  sed -i 's/hover:bg-emerald-700/hover:bg-teal-800/g' "$file"
  
  sed -i 's/bg-emerald-50/bg-slate-50/g' "$file"
  sed -i 's/text-emerald-900/text-slate-900/g' "$file"
  sed -i 's/text-emerald-800/text-teal-800/g' "$file"
  sed -i 's/text-emerald-700/text-teal-700/g' "$file"
  sed -i 's/text-emerald-600/text-teal-600/g' "$file"
  sed -i 's/border-emerald-200/border-teal-200/g' "$file"
  sed -i 's/border-emerald-100/border-teal-100/g' "$file"
  sed -i 's/bg-emerald-100/bg-teal-100/g' "$file"
  
  sed -i 's/bg-emerald-500/bg-teal-600/g' "$file"
  sed -i 's/border-emerald-500/border-teal-500/g' "$file"
  
  # Admin specific
  sed -i 's/from-emerald-100 to-emerald-50/from-teal-100 to-teal-50/g' "$file"
done
