const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('C:\\Users\\34712\\.cc-switch\\cc-switch.db');

const newKey = 'sk-cdmmuoc4sdgmgjlovhbdwk94ltds7yg391rmn0l0fc0yysdf';

// Update the Mimo provider with the new API key
// The settings_config is a JSON string containing env vars
const newConfig = JSON.stringify({
  env: {
    "ANTHROPIC_BASE_URL": "https://token-plan-cn.xiaomimimo.com/anthropic",
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

db.run(
  "UPDATE providers SET settings_config = ? WHERE id = ?",
  [newConfig, '77a083e3-4d57-4643-a6c1-dfded2593250'],
  function(err) {
    if (err) {
      console.error('Update failed:', err.message);
    } else {
      console.log('Updated rows:', this.changes);
      console.log('Xiaomi Mimo API key configured successfully!');

      // Verify
      db.get("SELECT settings_config FROM providers WHERE id = ?",
        ['77a083e3-4d57-4643-a6c1-dfded2593250'],
        (e, row) => {
          if (row) {
            const cfg = JSON.parse(row.settings_config);
            console.log('Key set:', cfg.env.ANTHROPIC_AUTH_TOKEN ? 'YES (' + cfg.env.ANTHROPIC_AUTH_TOKEN.substring(0, 20) + '...)' : 'NO');
          }
          db.close();
          process.exit(0);
        }
      );
    }
  }
);
