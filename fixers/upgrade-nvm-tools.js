// Copyright © 2020 Jan Keromnes.
// The following code is covered by the MIT license.

const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.id = 'upgrade-nvm-tools';

exports.register = async (fixers) => {
  const { stdout, stderr } = await exec('bash -lc ". ~/.nvm/nvm.sh && nvm ls-remote --no-colors"');
  if (stderr) {
    throw stderr;
  }

  const minorVersionReplacements = {};
  for (const line of stdout.split('\n')) {
    const match = line.trim().match(/^[->]*\s*([a-z1-9\.]+-)?v(\d+\.)(\d+\.\d+)\s*.*$/);
    if (!match) {
      continue;
    }

    const prefix = match[1] ? match[1] + 'v' : '';
    const pattern = (prefix + match[2]).replace(/\./g, '\\.') + '[0-9][0-9]*\\.[0-9][0-9]*';
    minorVersionReplacements[pattern] = prefix + match[2] + match[3];
  }
  console.log(minorVersionReplacements);

  fixers[1].push({
    id: 'upgrade-nvm-tools',
    cmd: `for dockerfile in \$(git ls-files | grep -i -E 'dockerfile\$'); do` +
      Object.keys(minorVersionReplacements).map(pattern => {
        // FIXME: This will "upgrade":
        //   https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh
        // to:
        //   https://raw.githubusercontent.com/nvm-sh/nvm/v0.12.18/install.sh
        return `
  sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/\\(nvm.*\\)${pattern}/\\1${minorVersionReplacements[pattern]}/g" $dockerfile ;
  sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/\\(NODE_VERSION.*\\)${pattern}/\\1${minorVersionReplacements[pattern]}/g" $dockerfile ;`;
      }).join('') +
      '\ndone',
    description: 'Update pinned nvm versions',
  });
};
