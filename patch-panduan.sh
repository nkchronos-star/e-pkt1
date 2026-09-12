#!/bin/bash
sed -i '/export default function Panduan() {/a \  const { infographics } = useAppContext();\
' src/components/dashboard/Panduan.tsx

sed -i 's/import { Info, CheckCircle, FileText, Calendar } from '"'"'lucide-react'"'"';/import { Info, CheckCircle, FileText, Calendar } from '"'"'lucide-react'"'"';\nimport { useAppContext } from '"'"'..\/..\/store'"'"';/' src/components/dashboard/Panduan.tsx

sed -i '/<div className="bg-gradient-to-r from-emerald-50/i \
      {infographics && infographics.length > 0 && (\
        <div className="mb-12">\
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-emerald-600" /> Infografik Panduan</h2>\
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">\
            {infographics.map((info) => (\
              <div key={info.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200">\
                <img src={info.url} alt={info.title} className="w-full h-auto object-contain bg-slate-50" />\
                <div className="p-4 border-t border-slate-100">\
                  <h3 className="font-bold text-slate-800">{info.title}</h3>\
                </div>\
              </div>\
            ))}\
          </div>\
        </div>\
      )}\
' src/components/dashboard/Panduan.tsx
