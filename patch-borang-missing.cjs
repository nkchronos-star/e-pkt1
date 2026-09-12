const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

const oldAlert = `           ) : (
              <div className="text-amber-700 flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 rounded-xl border border-amber-200 shadow-sm">
                <AlertCircle className="w-6 h-6" />
                <span className="text-sm font-bold">Sila lengkapkan semua maklumat dan tick kotak pengesahan untuk menghantar.</span>
              </div>
           )}`;

const newAlert = `           ) : (
              <div className="text-amber-700 flex flex-col gap-3 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 rounded-xl border border-amber-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6" />
                  <span className="text-sm font-bold">Borang tidak lengkap. Sila semak semula ruangan yang masih kosong:</span>
                </div>
                <ul className="text-xs list-disc list-inside font-medium opacity-80 columns-2">
                   {getMissingFields().map(m => <li key={m}>{m}</li>)}
                </ul>
              </div>
           )}`;
           
if(code.includes(oldAlert)) {
   code = code.replace(oldAlert, newAlert);
   fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
   console.log("Patched Missing Alert");
} else {
   console.log("Could not find oldAlert block");
}
