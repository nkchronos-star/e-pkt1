import re

with open('src/components/dashboard/SemakTemuduga.tsx', 'r') as f:
    content = f.read()

old_block = """  if (!isBuka) {
    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Semakan Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">Semakan kelayakan temuduga belum dibuka buat masa ini. Harap maklum.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
             Tarikh semakan akan dibuka: <span className="font-semibold">{new Date(settings.tarikhBukaTemuduga).toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    );
  }"""

new_block = """  const formatTarikh = (tarikhStr: string) => {
     if(!tarikhStr) return '-';
     const d = new Date(tarikhStr);
     if(isNaN(d.getTime())) return tarikhStr;
     const day = String(d.getDate()).padStart(2, '0');
     const month = d.toLocaleDateString('ms-MY', { month: 'long' });
     const year = d.getFullYear();
     return `${day} - ${month} - ${year}`;
  };

  if (!isBuka) {
    return (
      <div className="animate-in fade-in py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Semakan Belum Dibuka</h2>
          <p className="text-gray-600 mb-6">Semakan kelayakan temuduga belum dibuka buat masa ini. Harap maklum.</p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
             Tarikh semakan akan dibuka: <span className="font-semibold">{formatTarikh(settings.tarikhBukaTemuduga)}</span>
          </div>
        </div>
      </div>
    );
  }"""

content = content.replace(old_block, new_block)

with open('src/components/dashboard/SemakTemuduga.tsx', 'w') as f:
    f.write(content)
