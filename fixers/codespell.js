// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(child_process.exec);

exports.setup = async (fixers) => {
  const { stdout, stderr } = await exec('codespell --version');
  if (stderr) {
    throw stderr;
  }

  console.log(stdout);

  fixers[0].push({
    id: 'codespell',
    cmd: 'codespell -w',
    description: 'Fix spelling mistakes',
  });
};

exports.install = 'sudo apt-get install codespell'

