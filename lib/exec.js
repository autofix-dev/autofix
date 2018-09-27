// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const child_process = require('child_process');
const util = require('util');
const exec = util.promisify(child_process.exec);

module.exports = async (cmd) => {
  const { stdout, stderr } = await exec(cmd);
  if (stderr) {
    throw stderr;
  }

  return stdout;
};
