#!/bin/bash
for file in src/components/dashboard/*.tsx; do
  sed -i 's/blue-500/emerald-500/g' "$file"
  sed -i 's/blue-100/emerald-100/g' "$file"
  sed -i 's/blue-200/emerald-200/g' "$file"
  sed -i 's/blue-600/emerald-600/g' "$file"
  sed -i 's/blue-700/emerald-700/g' "$file"
  sed -i 's/blue-800/emerald-800/g' "$file"
  sed -i 's/blue-900/emerald-900/g' "$file"
  sed -i 's/blue-950/emerald-950/g' "$file"
  sed -i 's/blue-300/emerald-300/g' "$file"
  sed -i 's/blue-400/emerald-400/g' "$file"
  sed -i 's/blue-50/emerald-50/g' "$file"
done
