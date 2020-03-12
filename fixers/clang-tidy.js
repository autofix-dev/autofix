// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const util = require('util');
const exec = util.promisify(require('child_process').exec);

exports.register = async (fixers) => {
  const { stdout, stderr } = await exec('clang-tidy -list-checks -checks=*');
  if (stderr) {
    throw stderr;
  }

  for (const check of stdout.trim().split(/\n\s+/).slice(1)) {
    fixers[2].push({
      id: 'clang-tidy-' + check,
      cmd: 'run-clang-tidy -p obj-x86_64-pc-linux-gnu/ -fix -checks=-*,' + check + ' *',
      description: 'Fix C++ bugs',
    });
  }
};
