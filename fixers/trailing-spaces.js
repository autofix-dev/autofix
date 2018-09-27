// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(child_process.exec);

exports.register = async (fixers) => {
  fixers[0].push({
    id: 'trailing-spaces',
    cmd: 'find . -not \\( -name .svn -prune -o -name .git -prune -o -name .hg -prune \\) -type f -print0 | xargs -0 sed -i -e "s/[[:space:]]*$//"',
    description: 'Fix trailing spaces',
  });
};
