with open('src/components/dashboard/Borang.tsx', 'r') as f:
    content = f.read()

old_get_missing_fields = """  const getMissingFields = () => {
    const req = ['name', 'ic', 'tarikhLahir', 'tempatLahir', 'jantina', 'alamat1', 'poskod', 'daerah', 'negeri', 'namaSekolahRendah', 'namaBapa', 'icBapa', 'pekerjaanBapa', 'telefonBapa', 'namaIbu', 'icIbu', 'pekerjaanIbu', 'telefonIbu'];
    return req.filter(f => !formData[f as keyof Candidate]);
  };"""

new_get_missing_fields = """  const getMissingFields = () => {
    const req = ['gambarUrl', 'name', 'ic', 'tarikhLahir', 'tempatLahir', 'jantina', 'alamat1', 'poskod', 'daerah', 'negeri', 'namaSekolahRendah', 'namaBapa', 'icBapa', 'pekerjaanBapa', 'telefonBapa', 'namaIbu', 'icIbu', 'pekerjaanIbu', 'telefonIbu'];
    const fieldLabels: Record<string, string> = {
      gambarUrl: 'Gambar Pasport',
      name: 'Nama Penuh Calon',
      ic: 'No. Kad Pengenalan',
      tarikhLahir: 'Tarikh Lahir',
      tempatLahir: 'Tempat Lahir',
      jantina: 'Jantina',
      alamat1: 'Alamat (Baris 1)',
      poskod: 'Poskod',
      daerah: 'Daerah',
      negeri: 'Negeri',
      namaSekolahRendah: 'Nama Sekolah Rendah',
      namaBapa: 'Nama Bapa / Penjaga 1',
      icBapa: 'No. KP Bapa',
      pekerjaanBapa: 'Pekerjaan Bapa',
      telefonBapa: 'No. Telefon Bapa',
      namaIbu: 'Nama Ibu / Penjaga 2',
      icIbu: 'No. KP Ibu',
      pekerjaanIbu: 'Pekerjaan Ibu',
      telefonIbu: 'No. Telefon Ibu'
    };
    return req.filter(f => !formData[f as keyof Candidate]).map(f => fieldLabels[f] || f);
  };"""

content = content.replace(old_get_missing_fields, new_get_missing_fields)

with open('src/components/dashboard/Borang.tsx', 'w') as f:
    f.write(content)
