#!/bin/bash
sed -i 's/                      <div className="bg-emerald-50\/80 border/                      <>\n                      <div className="bg-emerald-50\/80 border/' src/components/dashboard/SemakTawaran.tsx
sed -i 's/                         <SuratTawaran candidate={result} \/>\n                      <\/div>\n                    ) : (/                         <SuratTawaran candidate={result} \/>\n                      <\/div>\n                      <\/>\n                    ) : (/' src/components/dashboard/SemakTawaran.tsx
