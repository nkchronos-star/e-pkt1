import re

with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

# Add candidates to useAppContext destructuring if not there
if 'const { settings } = useAppContext();' in content:
    content = content.replace('const { settings } = useAppContext();', 'const { settings, candidates } = useAppContext();')

# Calculate rujukanNumber
rujukan_logic = """  const tarikhSemasa = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  const tahunSesi = settings.sesiKemasukan?.substring(0, 4) || '2027';

  // Find candidate index based on LAYAK sorted by name
  const layakCandidates = candidates.filter(c => c.statusTemuduga === 'LAYAK').sort((a, b) => a.name.localeCompare(b.name));
  const candidateIndex = layakCandidates.findIndex(c => c.ic === candidate.ic);
  const rujukanNumber = candidateIndex !== -1 ? (candidateIndex + 1).toString().padStart(2, '0') : '00';"""

content = re.sub(r"  const tarikhSemasa.*?;(\n.*?tahunSesi.*?;)?", rujukan_logic, content, count=1, flags=re.DOTALL)

# Replace the header section
old_header = """      {/* Header Surat */}
      <div className="flex items-start mb-6 print:mb-1 border-b-2 border-black pb-4">
        <div className="flex items-center gap-6 w-full">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Jata Negara" className="w-20 h-auto object-contain " />
          <div className="flex-1 flex justify-between items-start">
            <div>
              <h1 className="font-bold text-base mb-1">SMA KOTA GELANGGI 3</h1>
              <p className="leading-tight uppercase text-[13px]">
                KOTA GELANGGI 3<br/>
                27000 JERANTUT<br/>
                PAHANG DARUL MAKMUR
              </p>
            </div>
            <div className="text-[13px] leading-tight mt-6 print:mt-1">
              <p>Tel: 09-2051555</p>              
              <p>E-MEL: cft2001@moe.edu.my</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6 print:mb-1">
        <table className="text-[13px]">
          <tbody>
            <tr>
              <td className="pr-4">Rujukan Kami</td>
              <td>: SMAKG03.700-2/1/1( )</td>
            </tr>
            <tr>
              <td className="pr-4">Tarikh</td>
              <td>: {settings.tarikhSuratPanggilan || tarikhSemasa}</td>
            </tr>
          </tbody>
        </table>
      </div>"""

new_header = """      {/* Header Surat */}
      <div className="flex items-start mb-2 print:mb-1 border-b-2 border-gray-400 pb-3">
        <div className="flex items-center gap-6 w-full">
          <img src="https://i.postimg.cc/mrcDcHn3/logo-sma-cantik.png" alt="Jata Negara" className="w-24 h-auto object-contain " />
          <div className="flex-1 flex justify-between items-end">
            <div className="text-gray-500">
              <h1 className="font-bold text-xl mb-1 tracking-wide">SMA KOTA GELANGGI 3</h1>
              <p className="leading-tight uppercase text-sm">
                27000 JERANTUT<br/>
                PAHANG DARUL MAKMUR
              </p>
            </div>
            <div className="text-xs leading-tight text-gray-500 text-right">
              <p>Tel:09-2051555</p>              
              <p>E-MEL:<a href="mailto:cft2001@moe.edu.my" className="text-blue-500 underline">cft2001@moe.edu.my</a></p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6 print:mb-2 text-black">
        <div className="text-[13px]">
          <p className="mb-0.5"><span className="inline-block w-24">Rujukan Kami</span>: SMAKG03.700-2/1/1({rujukanNumber})</p>
          <p><span className="inline-block w-24">Tarikh</span>: {settings.tarikhSuratPanggilan || tarikhSemasa}</p>
        </div>
      </div>"""

content = content.replace(old_header, new_header)

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(content)

