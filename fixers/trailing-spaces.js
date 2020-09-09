// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const os = require('os');

exports.register = async (fixers) => {
  fixers[0].push({
    id: 'trailing-spaces',
    // Fix only non-binary files. Source: https://unix.stackexchange.com/a/36240
    cmd: `git grep -I --name-only -z -e '' | xargs -0 sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/[[:space:]]*$//"`,
    description: 'Fix trailing spaces',
  });
};
