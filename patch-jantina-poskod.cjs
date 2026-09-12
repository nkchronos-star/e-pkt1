const fs = require('fs');
let code = fs.readFileSync('src/components/dashboard/Borang.tsx', 'utf8');

// Jantina Huruf Besar
const jantinaMatch = `updates.jantina = lastDigit % 2 === 0 ? 'Perempuan' : 'Lelaki';`;
const jantinaReplace = `updates.jantina = lastDigit % 2 === 0 ? 'PEREMPUAN' : 'LELAKI';`;
if (code.includes(jantinaMatch)) {
   code = code.replace(jantinaMatch, jantinaReplace);
}

// Poskod logic
const handleMatch = `    } else {
      setFormData(prev => {
         let updates: any = { [name]: value };
         if (name === 'ic' && value) {`;

const handleReplace = `    } else {
      setFormData(prev => {
         let updates: any = { [name]: value };
         
         // Poskod Auto Detect
         if (name === 'poskod' && value.length >= 2) {
             const prefix = value.substring(0, 2);
             const stateMap: Record<string, string> = {
                '01': 'Perlis', '02': 'Perlis', '05': 'Kedah', '06': 'Kedah', '07': 'Kedah', '08': 'Kedah', '09': 'Kedah',
                '10': 'Pulau Pinang', '11': 'Pulau Pinang', '12': 'Pulau Pinang', '13': 'Pulau Pinang', '14': 'Pulau Pinang',
                '15': 'Kelantan', '16': 'Kelantan', '17': 'Kelantan', '18': 'Kelantan',
                '20': 'Terengganu', '21': 'Terengganu', '22': 'Terengganu', '23': 'Terengganu', '24': 'Terengganu',
                '25': 'Pahang', '26': 'Pahang', '27': 'Pahang', '28': 'Pahang', '39': 'Pahang', '49': 'Pahang', '69': 'Pahang',
                '30': 'Perak', '31': 'Perak', '32': 'Perak', '33': 'Perak', '34': 'Perak', '35': 'Perak', '36': 'Perak',
                '40': 'Selangor', '41': 'Selangor', '42': 'Selangor', '43': 'Selangor', '44': 'Selangor', '45': 'Selangor', '46': 'Selangor', '47': 'Selangor', '48': 'Selangor',
                '50': 'W.P. Kuala Lumpur', '51': 'W.P. Kuala Lumpur', '52': 'W.P. Kuala Lumpur', '53': 'W.P. Kuala Lumpur', '54': 'W.P. Kuala Lumpur', '55': 'W.P. Kuala Lumpur', '56': 'W.P. Kuala Lumpur', '57': 'W.P. Kuala Lumpur', '58': 'W.P. Kuala Lumpur', '59': 'W.P. Kuala Lumpur',
                '60': 'W.P. Kuala Lumpur', '62': 'W.P. Putrajaya', '63': 'Selangor', '64': 'Selangor', '68': 'Selangor',
                '70': 'Negeri Sembilan', '71': 'Negeri Sembilan', '72': 'Negeri Sembilan', '73': 'Negeri Sembilan',
                '75': 'Melaka', '76': 'Melaka', '77': 'Melaka', '78': 'Melaka',
                '79': 'Johor', '80': 'Johor', '81': 'Johor', '82': 'Johor', '83': 'Johor', '84': 'Johor', '85': 'Johor', '86': 'Johor',
                '87': 'W.P. Labuan',
                '88': 'Sabah', '89': 'Sabah', '90': 'Sabah', '91': 'Sabah',
                '93': 'Sarawak', '94': 'Sarawak', '95': 'Sarawak', '96': 'Sarawak', '97': 'Sarawak', '98': 'Sarawak'
             };
             if (stateMap[prefix]) {
                 updates.negeri = stateMap[prefix].toUpperCase();
             }
         }

         if (name === 'ic' && value) {`;

if (code.includes(handleMatch)) {
   code = code.replace(handleMatch, handleReplace);
}

fs.writeFileSync('src/components/dashboard/Borang.tsx', code);
console.log("Patched Jantina & Poskod");
