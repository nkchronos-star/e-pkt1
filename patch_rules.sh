sed -i "s/\['userId', 'status', 'studentName', 'icNumber', 'createdAt', 'updatedAt'\]/\['userId', 'status', 'studentName', 'icNumber', 'candidateData', 'createdAt', 'updatedAt'\]/g" firestore.rules
sed -i "/data.icNumber is string/a \             data.candidateData is map \&\&" firestore.rules
sed -i "s/incoming().keys().size() == 6/incoming().keys().size() == 7/g" firestore.rules
sed -i "s/\['status', 'studentName', 'icNumber', 'updatedAt'\]/\['status', 'studentName', 'icNumber', 'candidateData', 'updatedAt'\]/g" firestore.rules
