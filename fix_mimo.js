const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('C:\\Users\\34712\\.cc-switch\\cc-switch.db');

const newKey = 'sk-cdmmuoc4sdgmgjlovhbdwk94ltds7yg391rmn0l0fc0yysdf';

// Fix 1: Update base URL from token-plan to api.xiaomimimo.com
const newConfig = JSON.stringify({
  env: {
    "ANTHROPIC_BASE_URL": "https://api.xiaomimimo.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": newKey,
    "ANTHROPIC_MODEL": "mimo-v2.5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "mimo-v2.5",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "mimo-v2.5-pro[1M]",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "mimo-v2.5-pro[1M]",
    "ANTHROPIC_DEFAULT_SONNET_MODEL_NAME": "mimo-v2.5-pro",
    "ANTHROPIC_DEFAULT_OPUS_MODEL_NAME": "mimo-v2.5-pro",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL_NAME": "mimo-v2.5"
  }
});

// Fix 2: Update endpoint URL
db.run("UPDATE provider_endpoints SET url = ? WHERE provider_id = ?",
  ['https://api.xiaomimimo.com/anthropic', '77a083e3-4d57-4643-a6c1-dfded2593250']);

// Fix 3: Update settings_config
db.run("UPDATE providers SET settings_config = ? WHERE id = ?",
  [newConfig, '77a083e3-4d57-4643-a6c1-dfded2593250']);

// Fix 4: Update meta with correct usage script
const newMeta = JSON.stringify({
  "commonConfigEnabled": true,
  "endpointAutoSelect": true,
  "apiFormat": "anthropic",
  "usage_script": {
    "enabled": true,
    "language": "javascript",
    "code": "const key = env.ANTHROPIC_AUTH_TOKEN;\nconst resp = await fetch('https://api.xiaomimimo.com/v1/usage', { headers: { 'Authorization': 'Bearer ' + key } });\nif (!resp.ok) throw new Error('HTTP ' + resp.status);\nconst data = await resp.json();\nreturn { total: data.total_credits || 0, used: data.used_credits || 0, remaining: data.remaining_credits || 0 };\n",
    "timeout": 10,
    "templateType": "balance",
    "autoQueryInterval": 10
  }
});

db.run("UPDATE providers SET meta = ? WHERE id = ?",
  [newMeta, '77a083e3-4d57-4643-a6c1-dfded2593250']);

// Verify
setTimeout(() => {
  db.get("SELECT settings_config, meta FROM providers WHERE id = ?",
    ['77a083e3-4d57-4643-a6c1-dfded2593250'],
    (e, row) => {
      if (row) {
        const cfg = JSON.parse(row.settings_config);
        const meta = JSON.parse(row.meta);
        console.log('Base URL:', cfg.env.ANTHROPIC_BASE_URL);
        console.log('Key set:', cfg.env.ANTHROPIC_AUTH_TOKEN ? 'YES' : 'NO');
        console.log('Usage script:', meta.usage_script ? 'YES' : 'NO');
      }
      db.close();
      process.exit(0);
    }
  );
}, 500);
