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
  const releases = await get('https://github.com/mozilla/rr/releases');
  const versions = releases
    .match(/\/mozilla\/rr\/releases\/download\/\d+\.\d+\.\d+\/rr-[0-9.]+-Linux-x86_64\.deb/g)
    .map(path => path.split('/')[5]);
  const latest = versions.shift();

  fixers[0].push({
    id: 'upgrade-rr',
    cmd: `for file in \$(git ls-files); do` +
      versions.map(version => {
        const pattern = version.replace(/\./g, '\\.');
        return `
  sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/\\(RR_VERSION.*\\)${pattern}/\\1${latest}/g" $file ;
  sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/\\(mozilla\\/rr\\/releases\\/download.*\\)${pattern}\\(.*\\)${pattern}/\\1${latest}\\2${latest}/g" $file ;`;
      }).join('') +
      '\ndone',
    description: 'Update pinned rr version',
  });
};
