// Copyright © 2020 Jan Keromnes.
// The following code is covered by the MIT license.

exports.register = async (fixers) => {
  fixers[0].push({
    id: 'update-git-submodule',
    cmd: `git submodule update --remote`,
    description: 'Update Git submodules',
  });
};
