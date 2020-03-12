// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.register = async (fixers) => {
  const { stdout, stderr } = await exec('codespell --version 2>&1');
  if (stderr) {
    throw stderr;
  }

  fixers[1].push({
    id: 'codespell',
    cmd: 'codespell -w > /dev/null 2>&1',
    description: 'Fix spelling mistakes',
  });
};
