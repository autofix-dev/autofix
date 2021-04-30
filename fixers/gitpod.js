// Copyright © 2021 Jan Keromnes.
// The following code is covered by the MIT license.

const os = require('os');

exports.register = async (fixers) => {
  fixers[0].push({
    id: 'gitpod-badge-color',
    // Fix only non-binary files. Source: https://unix.stackexchange.com/a/36240
    cmd: `git grep -I --name-only -z -e '' | xargs -0 sed ${os.type() === 'Darwin' ? '-i "" -E' : '-i -e'} "s/https:\\/\\/img\\.shields\\.io\\/badge\\/\\([A-Za-z0-9_\\-]*\\)-blue?logo=gitpod/https:\\/\\/img.shields.io\\/badge\\/\\1-908a85?logo=gitpod/g"`,
    description: 'Fix Gitpod badge color',
  });
};
