// Copyright © 2020 Jan Keromnes.
// The following code is covered by the MIT license.

const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.id = 'update-pyenv';

exports.register = async (fixers) => {
  const { stdout, stderr } = await exec('pyenv install --list');
  if (stderr) {
    throw stderr;
  }

  for (const line of stdout.split('\n').slice(1,-1)) {
    console.log(line.trim());
  }

  fixers[0].push({
    id: 'update-pyenv',
    cmd: `for dockerfile in \$(git ls-files | grep -i -E 'dockerfile\$'); do
      echo "a" >> $dockerfile ;
    done`,
    description: 'Update pinned pyenv versions',
  });
};
