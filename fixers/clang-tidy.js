// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(child_process.exec);

exports.register = async (fixers) => {
  const { stdout, stderr } = await exec('clang-tidy-6.0 -list-checks -checks=*');
  if (stderr) {
    throw stderr;
  }

  for (const check of stdout.trim().split(/\n\s+/).slice(1)) {
    fixers[2].push({
      id: 'clang-tidy-' + check,
      cmd: 'run-clang-tidy-6.0.py -p obj-x86_64-pc-linux-gnu/ -fix -checks=-*,' + check + ' *',
      description: 'Fix C++ bugs',
    });
  }

};

