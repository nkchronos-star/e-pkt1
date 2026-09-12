#!/bin/bash
sed -i '/const isFormComplete =/i \
  const [tiadaBapa, setTiadaBapa] = useState(false);\
  const [tiadaIbu, setTiadaIbu] = useState(false);\
\
  const copyAddressToBapa = () => {\
    setFormData(prev => ({\
      ...prev,\
      alamatBapa1: prev.alamat1 || '"''"',\
      alamatBapa2: prev.alamat2 || '"''"',\
      poskodBapa: prev.poskod || '"''"',\
      daerahBapa: prev.daerah || '"''"',\
      negeriBapa: prev.negeri || '"''"',\
    }));\
  };\
\
  const copyAddressToIbu = () => {\
    setFormData(prev => ({\
      ...prev,\
      alamatIbu1: prev.alamat1 || '"''"',\
      alamatIbu2: prev.alamat2 || '"''"',\
      poskodIbu: prev.poskod || '"''"',\
      daerahIbu: prev.daerah || '"''"',\
      negeriIbu: prev.negeri || '"''"',\
    }));\
  };\
\
  const handleTiadaBapa = (checked: boolean) => {\
    setTiadaBapa(checked);\
    if(checked) {\
       setFormData(prev => ({\
          ...prev,\
          namaBapa: '"'TIADA MAKLUMAT'"',\
          icBapa: '"'-'"',\
          warganegaraBapa: '"'-'"',\
          alamatBapa1: '"'-'"',\
          alamatBapa2: '"'-'"',\
          poskodBapa: '"'-'"',\
          daerahBapa: '"'-'"',\
          negeriBapa: '"'-'"',\
          pekerjaanBapa: '"'-'"',\
          telefonBapa: '"'-'"'\
       }));\
    } else {\
       setFormData(prev => ({\
          ...prev,\
          namaBapa: '"''"', icBapa: '"''"', warganegaraBapa: '"''"', alamatBapa1: '"''"', alamatBapa2: '"''"', poskodBapa: '"''"', daerahBapa: '"''"', negeriBapa: '"''"', pekerjaanBapa: '"''"', telefonBapa: '"''"'\
       }));\
    }\
  };\
\
  const handleTiadaIbu = (checked: boolean) => {\
    setTiadaIbu(checked);\
    if(checked) {\
       setFormData(prev => ({\
          ...prev,\
          namaIbu: '"'TIADA MAKLUMAT'"',\
          icIbu: '"'-'"',\
          warganegaraIbu: '"'-'"',\
          alamatIbu1: '"'-'"',\
          alamatIbu2: '"'-'"',\
          poskodIbu: '"'-'"',\
          daerahIbu: '"'-'"',\
          negeriIbu: '"'-'"',\
          pekerjaanIbu: '"'-'"',\
          telefonIbu: '"'-'"'\
       }));\
    } else {\
       setFormData(prev => ({\
          ...prev,\
          namaIbu: '"''"', icIbu: '"''"', warganegaraIbu: '"''"', alamatIbu1: '"''"', alamatIbu2: '"''"', poskodIbu: '"''"', daerahIbu: '"''"', negeriIbu: '"''"', pekerjaanIbu: '"''"', telefonIbu: '"''"'\
       }));\
    }\
  };\
' src/components/dashboard/Borang.tsx
