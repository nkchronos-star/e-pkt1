#!/bin/bash
for file in src/components/dashboard/*.tsx; do
  sed -i 's/teal-500/blue-500/g' "$file"
  sed -i 's/teal-100/blue-100/g' "$file"
  sed -i 's/teal-200/blue-200/g' "$file"
  sed -i 's/teal-600/blue-600/g' "$file"
  sed -i 's/teal-700/blue-600/g' "$file"
  sed -i 's/teal-800/blue-700/g' "$file"
  sed -i 's/teal-900/blue-800/g' "$file"
  sed -i 's/teal-950/blue-900/g' "$file"
  sed -i 's/teal-300/blue-300/g' "$file"
  sed -i 's/teal-400/blue-400/g' "$file"
  sed -i 's/teal-50/blue-50/g' "$file"
done
