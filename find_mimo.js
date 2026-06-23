const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('C:\\Users\\34712\\.cc-switch\\cc-switch.db');

// Find Mimo/Xiaomi providers
db.all("SELECT * FROM providers WHERE name LIKE '%mimo%' OR name LIKE '%Mimo%' OR name LIKE '%xiaomi%' OR name LIKE '%Xiaomi%'", [], (e, rows) => {
  console.log('=== Mimo Providers ===');
  if (rows && rows.length > 0) {
    rows.forEach(r => console.log(JSON.stringify(r, null, 2)));

    // Also find endpoints for these providers
    rows.forEach(r => {
      db.all("SELECT * FROM provider_endpoints WHERE provider_id=?", [r.id], (e2, eps) => {
        console.log('=== Endpoints for', r.name, '===');
        if (eps) eps.forEach(ep => console.log(JSON.stringify(ep, null, 2)));
      });
    });
  } else {
    console.log('No Mimo providers found. Listing all custom providers:');
    db.all("SELECT id, name, category FROM providers WHERE category != 'official'", [], (e3, rows3) => {
      if (rows3) rows3.forEach(r => console.log(JSON.stringify(r)));
    });
  }
});

// Find current provider
db.get("SELECT * FROM providers WHERE id=?", ['a47be31c-6f02-40b5-845d-0c8a673ea4e8'], (e, row) => {
  console.log('\n=== Current Active Provider ===');
  if (row) console.log(JSON.stringify(row, null, 2));
});

setTimeout(() => { db.close(); process.exit(0); }, 3000);
