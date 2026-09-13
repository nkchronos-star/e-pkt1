with open('src/components/dashboard/EditCandidateModal.tsx', 'r') as f:
    content = f.read()

# Replace all negeri options with uppercase
replacements = {
    'value="Johor">Johor</option>': 'value="JOHOR">JOHOR</option>',
    'value="Kedah">Kedah</option>': 'value="KEDAH">KEDAH</option>',
    'value="Kelantan">Kelantan</option>': 'value="KELANTAN">KELANTAN</option>',
    'value="Melaka">Melaka</option>': 'value="MELAKA">MELAKA</option>',
    'value="Negeri Sembilan">Negeri Sembilan</option>': 'value="NEGERI SEMBILAN">NEGERI SEMBILAN</option>',
    'value="Pahang">Pahang</option>': 'value="PAHANG">PAHANG</option>',
    'value="Perak">Perak</option>': 'value="PERAK">PERAK</option>',
    'value="Perlis">Perlis</option>': 'value="PERLIS">PERLIS</option>',
    'value="Pulau Pinang">Pulau Pinang</option>': 'value="PULAU PINANG">PULAU PINANG</option>',
    'value="Sabah">Sabah</option>': 'value="SABAH">SABAH</option>',
    'value="Sarawak">Sarawak</option>': 'value="SARAWAK">SARAWAK</option>',
    'value="Selangor">Selangor</option>': 'value="SELANGOR">SELANGOR</option>',
    'value="Terengganu">Terengganu</option>': 'value="TERENGGANU">TERENGGANU</option>',
    'value="Kuala Lumpur">W.P. Kuala Lumpur</option>': 'value="W.P. KUALA LUMPUR">W.P. KUALA LUMPUR</option>',
    'value="Labuan">W.P. Labuan</option>': 'value="W.P. LABUAN">W.P. LABUAN</option>',
    'value="Putrajaya">W.P. Putrajaya</option>': 'value="W.P. PUTRAJAYA">W.P. PUTRAJAYA</option>'
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('src/components/dashboard/EditCandidateModal.tsx', 'w') as f:
    f.write(content)

