// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const minimist = require('minimist');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const argv = minimist(process.argv.slice(2));

module.exports = async (cmd, ignoreDry = false) => {
  if (argv.dry || argv.verbose) {
    console.log(`  Running: ${cmd}`);
  }

  if (argv.dry && !ignoreDry) {
    return '';
  }

  const { stdout, stderr } = await exec(cmd);
  if (stderr) {
    throw stderr;
  }

  return stdout;
};
