// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(child_process.exec);

exports.setup = async (fixers) => {
  fixers[0].push({
    id: 'trailing-spaces',
    cmd: 'find . -not -iwholename "*.git*" -type f -print0 | xargs -0 perl -pi -e "s/\\s+$//"',
    description: 'Fix trailing spaces',
  });
};
