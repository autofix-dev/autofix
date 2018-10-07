// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const exec = require('../lib/exec');

exports.register = async (fixers) => {
  const stdout = await exec('clang-tidy-7 -list-checks -checks=*', true);

  for (const check of stdout.trim().split(/\n\s+/).slice(1)) {
    fixers[2].push({
      id: 'clang-tidy-' + check,
      cmd: 'run-clang-tidy-7.py -p obj-x86_64-pc-linux-gnu/ -fix -checks=-*,' + check + ' *',
      description: 'Fix C++ bugs',
    });
  }
};

