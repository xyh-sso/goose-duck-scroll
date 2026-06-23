const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('C:\\Users\\34712\\.cc-switch\\cc-switch.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) { console.error(err); return; }
  console.log('Tables:', tables.map(t => t.name));

  const targetTables = tables.filter(t =>
    t.name.toLowerCase().includes('provider') ||
    t.name.toLowerCase().includes('model') ||
    t.name.toLowerCase().includes('api') ||
    t.name.toLowerCase().includes('auth')
  );

  let done = 0;
  targetTables.forEach(t => {
    db.all('SELECT * FROM [' + t.name + ']', [], (e, rows) => {
      console.log('\n=== ' + t.name + ' ===');
      if (rows) rows.forEach(r => console.log(JSON.stringify(r, null, 2)));
      done++;
      if (done === targetTables.length) {
        db.close();
        process.exit(0);
      }
    });
  });

  if (targetTables.length === 0) {
    // Dump all tables to find the right one
    tables.forEach(t => {
      db.all('SELECT * FROM [' + t.name + '] LIMIT 10', [], (e, rows) => {
        console.log('\n--- ' + t.name + ' ---');
        if (rows) rows.forEach(r => console.log(JSON.stringify(r)));
      });
    });
    setTimeout(() => { db.close(); process.exit(0); }, 2000);
  }
});
