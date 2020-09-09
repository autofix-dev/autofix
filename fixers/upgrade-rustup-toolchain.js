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

exports.register = async (fixers) => {
  const releases = await get('https://github.com/rust-lang/rust/releases');
  const versions = releases
    .match(/\/rust-lang\/rust\/releases\/tag\/\d+\.\d+\.\d+/g)
    .map(path => path.split('/')[5]);
  const latest = versions.shift();

  fixers[0].push({
    id: 'upgrade-rustup-toolchain',
    // Fix only non-binary files. Source: https://unix.stackexchange.com/a/36240
    cmd: `for file in \$(git grep -I --name-only -z -e '' | xargs -0 echo); do` +
      versions.map(version => {
        const pattern = version.replace(/\./g, '\\.');
        return `
  sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/\\(rustup.*\\)${pattern}\\([^\d]\\)/\\1${latest}\\2/g" $file ;`;
      }).join('') +
      '\ndone',
    description: 'Update pinned rustup toolchain versions',
  });
};
