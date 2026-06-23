const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('C:\\Users\\34712\\.cc-switch\\cc-switch.db');

// Update Mimo provider meta to include usage script
const newMeta = JSON.stringify({
  "commonConfigEnabled": true,
  "endpointAutoSelect": true,
  "apiFormat": "anthropic",
  "usage_script": {
    "enabled": true,
    "language": "javascript",
    "code": "const key = env.ANTHROPIC_AUTH_TOKEN;\nconst baseUrl = 'https://token-plan-cn.xiaomimimo.com/v1';\nconst resp = await fetch(baseUrl + '/usage', { headers: { 'Authorization': 'Bearer ' + key } });\nif (!resp.ok) throw new Error('HTTP ' + resp.status);\nconst data = await resp.json();\nreturn { total: data.total_credits || 0, used: data.used_credits || 0, remaining: data.remaining_credits || 0 };\n",
    "timeout": 10,
    "templateType": "balance",
    "autoQueryInterval": 10
  }
});

db.run(
  "UPDATE providers SET meta = ? WHERE id = ?",
  [newMeta, '77a083e3-4d57-4643-a6c1-dfded2593250'],
  function(err) {
    if (err) { console.error('Update failed:', err.message); }
    else { console.log('Usage script added! Rows updated:', this.changes); }
    db.close();
    process.exit(0);
  }
);
