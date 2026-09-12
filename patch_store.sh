#!/bin/bash
sed -i "s/import { Candidate/import { User as FirebaseUser } from 'firebase\/auth';\nimport { auth } from '.\/lib\/firebase';\nimport { onAuthStateChanged } from 'firebase\/auth';\nimport { doc, getDoc } from 'firebase\/firestore';\nimport { db } from '.\/lib\/firebase';\nimport { Candidate/g" src/store.tsx

sed -i "s/  currentUser: User | null;/  currentUser: User | null;\n  firebaseUser: FirebaseUser | null;\n  userRole: 'admin' | 'staff' | 'calon' | null;/g" src/store.tsx

sed -i "s/      currentUser: null,/      currentUser: null,\n      firebaseUser: null,\n      userRole: null,/g" src/store.tsx

# Find the spot after }, []); to add auth listener
cat << 'INNER_EOF' >> add_auth.txt
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setState(prev => ({ ...prev, firebaseUser: user }));
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setState(prev => ({ ...prev, userRole: userDoc.data().role }));
          }
        } catch (e) {
          console.error("Error fetching user role", e);
        }
      } else {
        setState(prev => ({ ...prev, firebaseUser: null, userRole: null }));
      }
    });
    return () => unsubscribe();
  }, []);
INNER_EOF

# Let's just insert it using node since sed multiline is tricky
node -e "
const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');
const hookStr = fs.readFileSync('add_auth.txt', 'utf8');
code = code.replace('  }, []);\n\n  const saveCandidate', '  }, []);\n\n' + hookStr + '\n\n  const saveCandidate');
fs.writeFileSync('src/store.tsx', code);
"
