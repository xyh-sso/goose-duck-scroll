// Deploy to Netlify using their API
const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\34712\\Desktop\\goose-duck';
const siteName = 'goose-duck-scroll';

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Create a zip file manually
const { execSync } = require('child_process');

// Use PowerShell to create zip
const zipPath = path.join(dir, 'deploy.zip');
try { fs.unlinkSync(zipPath); } catch(e) {}

console.log('Creating zip...');
execSync(`powershell -Command "Compress-Archive -Path '${dir}\\index.html' -DestinationPath '${zipPath}' -Force"`, { stdio: 'pipe' });
console.log('Zip created:', fs.statSync(zipPath).size, 'bytes');

// Step 1: Create a new Netlify site
function netlifyRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.netlify.com',
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'netlify-deploy-script/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function deploy() {
  try {
    // Create site
    console.log('Creating Netlify site...');
    const site = await netlifyRequest('POST', '/api/v1/sites', {
      name: siteName,
      default_hooks_data: {},
      force_ssl: true
    });
    console.log('Site response:', site.status, JSON.stringify(site.data).substring(0, 500));

    if (site.data && site.data.id) {
      console.log('\nSite created! ID:', site.data.id);
      console.log('URL:', site.data.ssl_url || site.data.url);

      // Now deploy - upload the file directly
      const deployResult = await netlifyRequest('POST', `/api/v1/sites/${site.data.id}/deploys`, {
        files: {
          '/index.html': Buffer.from(htmlContent).toString('base64')
        },
        draft: false
      });
      console.log('Deploy response:', deployResult.status);
    }
  } catch(e) {
    console.error('Error:', e.message);
  }
}

deploy();
