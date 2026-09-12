import re

with open('firestore.rules', 'r') as f:
    content = f.read()

new_rules = """    match /users/{userId} {
      allow read, write: if true; 
    }
    match /config/{configId} {
      allow read, write: if true;
    }
    match /candidates/{candidateId} {
      allow read, write: if true;
    }
    match /infographics/{infoId} {
      allow read, write: if true;
    }"""

content = re.sub(r"    match /users/\{userId\} \{.*?(?=\s*\})\}", new_rules, content, flags=re.DOTALL)

with open('firestore.rules', 'w') as f:
    f.write(content)
