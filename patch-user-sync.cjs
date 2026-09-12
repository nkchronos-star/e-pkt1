const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf8');

const syncSettingsStr = `    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      body: sheetData
    }).then(() => alert('Tetapan berjaya diselaraskan ke Pangkalan Data (Google Sheets)!'))
      .catch(e => console.error("Sync error", e));
  };`;

const syncSettingsReplace = `    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      body: sheetData
    }).then(() => alert('Tetapan berjaya diselaraskan ke Pangkalan Data (Google Sheets)!'))
      .catch(e => console.error("Sync error", e));
  };

  const syncUsersToServer = (usersList: User[]) => {
    const sheetData = new FormData();
    sheetData.append('action', 'updateUsers');
    sheetData.append('usersData', JSON.stringify(usersList));

    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec', {
      method: 'POST',
      body: sheetData
    }).then(() => console.log('Users synced to server!'))
      .catch(e => console.error("Sync users error", e));
  };`;

code = code.replace(syncSettingsStr, syncSettingsReplace);

const fetchSettingsStr = `      }).catch(e => console.log('Offline/No settings fetched yet'));
  }, []);`;

const fetchSettingsReplace = `      }).catch(e => console.log('Offline/No settings fetched yet'));
      
    // Fetch users on load
    fetch('https://script.google.com/macros/s/AKfycbwoqLCO4ejfSc-2mPR7pqpOJS86knmqzjaSMbdWPQqW_1stC5tGl9SFR1TBSmV3fA/exec?action=getUsers')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setState(prev => ({ ...prev, users: data }));
        }
      }).catch(e => console.log('Offline/No users fetched yet'));
  }, []);`;

code = code.replace(fetchSettingsStr, fetchSettingsReplace);

const oldAddUser = `  const addUser = (user: User) => {
    setState(prev => ({ ...prev, users: [...prev.users, user] }));
  };`;
const newAddUser = `  const addUser = (user: User) => {
    setState(prev => {
      const newUsers = [...prev.users, user];
      syncUsersToServer(newUsers);
      return { ...prev, users: newUsers };
    });
  };`;
code = code.replace(oldAddUser, newAddUser);

const oldUpdateUser = `  const updateUser = (id: string, user: Partial<User>) => {
    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === id ? { ...u, ...user } : u)
    }));
  };`;
const newUpdateUser = `  const updateUser = (id: string, user: Partial<User>) => {
    setState(prev => {
      const newUsers = prev.users.map(u => u.id === id ? { ...u, ...user } : u);
      syncUsersToServer(newUsers);
      return { ...prev, users: newUsers };
    });
  };`;
code = code.replace(oldUpdateUser, newUpdateUser);

const oldDeleteUser = `  const deleteUser = (id: string) => {
    setState(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== id)
    }));
  };`;
const newDeleteUser = `  const deleteUser = (id: string) => {
    setState(prev => {
      const newUsers = prev.users.filter(u => u.id !== id);
      syncUsersToServer(newUsers);
      return { ...prev, users: newUsers };
    });
  };`;
code = code.replace(oldDeleteUser, newDeleteUser);

fs.writeFileSync('src/store.tsx', code);
console.log("Success patching users.");
