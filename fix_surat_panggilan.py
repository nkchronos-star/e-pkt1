import re

with open('src/components/dashboard/SuratPanggilan.tsx', 'r') as f:
    content = f.read()

# Update paragraph 2 text
content = content.replace(
    '''<span>Sukacitanya dimaklumkan bahawa saudara/saudari dikehendaki menghadiri sesi temuduga hafazan dan akademik bagi sesi kemasukan tahun {settings.sesiKemasukan?.substring(0, 4) || '2026'}. Sesi temuduga akan dijalankan seperti ketetapan berikut:</span>''',
    '''<span>Sukacitanya dimaklumkan bahawa saudara/saudari telah <strong>TERPILIH</strong> sebagai calon untuk menghadiri sesi temuduga hafazan bagi Pengambilan Pelajar Tingkatan 1 di SMA Kota Gelanggi 3 tahun {settings.sesiKemasukan?.substring(0, 4) || '2026'}. Sesi temuduga akan dilaksanakan pada ketetapan berikut:</span>'''
)

# Update paragraph 3 text
content = content.replace(
    '''<span>Sekiranya saudara/saudari tidak hadir pada tarikh yang ditetapkan, secara automatik permohonan anda terbatal.</span>''',
    '''<span>Sekiranya saudara/saudari tidak menghadiri sesi temuduga pada tarikh dan masa yang telah ditetapkan, secara automatik permohonan adalah terbatal.</span>'''
)

# Update paragraph 4 text
content = content.replace(
    '''<span>Segala kerjasama yang diberikan amatlah dihargai.</span>''',
    '''<span>Segala kerjasama yang diberikan amat kami hargai dan didahului dengan ucapan terima kasih.</span>'''
)

# Reduce margins to ensure 1 page
content = content.replace('mb-4', 'mb-3 print:mb-2')
content = content.replace('mb-6', 'mb-4 print:mb-3')
content = content.replace('mt-4', 'mt-3 print:mt-2')
content = content.replace('mt-5', 'mt-4 print:mt-3')
content = content.replace('mt-6', 'mt-4 print:mt-3')
content = content.replace('py-1', 'py-0.5 print:py-0')
content = content.replace('mb-2', 'mb-2 print:mb-1')
content = content.replace('mb-3', 'mb-3 print:mb-2')
content = content.replace('p-6 sm:p-10', 'p-6 sm:p-8')

# Ensure scale is small enough
content = content.replace('transform: scale(0.95);', 'transform: scale(0.90);')
content = content.replace('text-xs', 'text-[11px]')
content = content.replace('text-sm', 'text-xs')

with open('src/components/dashboard/SuratPanggilan.tsx', 'w') as f:
    f.write(content)
