// Copyright © 2020 Jan Keromnes.
// The following code is covered by the MIT license.

const https = require('https');
const os = require('os');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 400) {
        reject(new Error(`Couldn't get ${url} - Response status: ${res.statusCode}`));
        return;
      }

      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('error', error => { reject(error); });
      res.on('end', () => { resolve(body); });
    }).on('error', error => {
      reject(error);
    });
  });
}

const modulesToUpgrade = [
  'golang.org/x/tools/gopls',
];

exports.register = async (fixers) => {
  const versionReplacements = {};

  for (moduleToUpgrade of modulesToUpgrade) {
    const content = await get(`https://pkg.go.dev/${moduleToUpgrade}?tab=versions`);
    const regex = new RegExp(`href\\s*=\\s*".*${moduleToUpgrade.replace(/\//g, '\\/')}@(v?\\d+\\.\\d+\\.\\d+)"`, 'g');
    const versions = [];
    let match;
    while (match = regex.exec(content)) {
      versions.push(match[1]);
    }
    const latest = versions.shift();

    for (version of versions) {
      if (latest.startsWith(version)) {
        // Don't replace the "v0.6.1" part in "v0.6.10", which would result in "v0.6.100" (instead, simply consider "v0.6.1" too old to be auto-upgraded)
        continue;
      }
      const pattern = `${moduleToUpgrade}@${version}`.replace(/\./g, '\\.').replace(/\//g, '\\/');
      versionReplacements[pattern] = `${moduleToUpgrade}@${latest}`.replace(/\//g, '\\/');
    }
  }

  fixers[0].push({
    id: 'upgrade-go-modules',
    cmd: `for dockerfile in \$(git ls-files | grep -i -E 'dockerfile\$'); do\n` +
      Object.keys(versionReplacements).map(pattern => {
        return `  sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/${pattern}/${versionReplacements[pattern]}/g" $dockerfile ;`;
      }).join('\n') +
      '\ndone',
    description: 'Update pinned Go module versions',
  });
};