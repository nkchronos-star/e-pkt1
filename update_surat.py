with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

old_block = """      <div className="mb-2 text-justify text-xs">
        <p className="mb-2">Sukacitanya perkara di atas adalah dirujuk.</p>
        
        <div className="mb-2 text-justify flex">
          <span className="w-8 shrink-0">1.</span>
          <span>Sehubungan perkara di atas, dengan hormatnya dimaklumkan bahawa saudara/saudari <strong>TERPILIH</strong> untuk menghadiri satu sesi temuduga seperti ketetapan berikut:</span>
        </div>

        <div className="ml-16 mb-2">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-0.5 w-24">Tarikh</td>
                <td className="py-0.5 font-bold">: {settings.tarikhTemuduga || '8 November 2025'}</td>
              </tr>
              <tr>
                <td className="py-0.5">Hari</td>
                <td className="py-0.5 font-bold">: {settings.hariTemuduga || 'Sabtu'}</td>
              </tr>
              <tr>
                <td className="py-0.5">Masa</td>
                <td className="py-0.5 font-bold">: {settings.masaTemuduga || '8.00 pagi'}</td>
              </tr>
              <tr>
                <td className="py-0.5">Tempat</td>
                <td className="py-0.5 font-bold">: {settings.tempatTemuduga || 'Laman Selera, SMA Kota Gelanggi 3'}</td>
              </tr>
              <tr>
                <td className="py-0.5">Pakaian</td>
                <td className="py-0.5 font-bold">: {settings.pakaianTemuduga || 'Uniform sekolah'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mb-2 text-justify indent-8">
          2.<span className="ml-4 inline-block">Semoga kehadiran saudara/saudari dapat melancarkan temuduga yang diadakan dengan jayanya.</span>
        </p>

        <p className="mb-4">Sekian, terima kasih.</p>
      </div>"""

new_block = """      <div className="mb-2 text-justify text-xs leading-relaxed">
        <p className="mb-4">Perkara di atas adalah dirujuk.</p>
        
        <div className="mb-4 text-justify flex">
          <span className="w-8 shrink-0">2.</span>
          <span>Sukacitanya dimaklumkan bahawa saudara/saudari dikehendaki menghadiri sesi temuduga hafazan dan akademik bagi sesi kemasukan tahun {settings.sesiKemasukan?.substring(0, 4) || '2026'}. Sesi temuduga akan dijalankan seperti ketetapan berikut:</span>
        </div>

        <div className="ml-10 mb-4">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 w-24">Tarikh</td>
                <td className="py-1 font-bold">: {settings.tarikhTemuduga || '8 November 2025'}</td>
              </tr>
              <tr>
                <td className="py-1">Hari</td>
                <td className="py-1 font-bold">: {settings.hariTemuduga || 'Sabtu'}</td>
              </tr>
              <tr>
                <td className="py-1">Masa</td>
                <td className="py-1 font-bold">: {settings.masaTemuduga || '8.00 pagi'}</td>
              </tr>
              <tr>
                <td className="py-1">Tempat</td>
                <td className="py-1 font-bold">: {settings.tempatTemuduga || 'Laman Selera, SMA Kota Gelanggi 3'}</td>
              </tr>
              <tr>
                <td className="py-1">Pakaian</td>
                <td className="py-1 font-bold">: {settings.pakaianTemuduga || 'Uniform sekolah'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-4 text-justify flex">
          <span className="w-8 shrink-0">3.</span>
          <span>Sekiranya saudara/saudari tidak hadir pada tarikh yang ditetapkan, secara automatik permohonan anda terbatal.</span>
        </div>

        <div className="mb-6 text-justify flex">
          <span className="w-8 shrink-0">4.</span>
          <span>Segala kerjasama yang diberikan amatlah dihargai.</span>
        </div>

        <p className="mb-4">Sekian, terima kasih.</p>
      </div>"""

content = content.replace(old_block, new_block)

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(content)
