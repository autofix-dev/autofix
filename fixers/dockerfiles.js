// Copyright © 2020 Jan Keromnes.
// The following code is covered by the MIT license.

const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.id = 'dockerfiles';

exports.register = async (fixers) => {
  fixers[0].push({
    id: 'dockerfiles-update-pinned',
    cmd: 'git ls-files | grep -i -E "dockerfile\\$"',
    description: 'Update pinned tool versions in Dockerfiles',
  });
};
