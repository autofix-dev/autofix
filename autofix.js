// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const child_process = require('child_process');
const minimist = require('minimist');
const util = require('util');
const exec = util.promisify(child_process.exec);

const argv = minimist(process.argv.slice(2));

// TODO parse tiers

const fixers = [ [], [], [], [] ];

// TODO detect available autofixers

Promise.all([
  require('./fixers/codespell'),
  require('./fixers/trailing-spaces'),
  require('./fixers/clang-tidy'),
].map(async (fixer) => {
  try {
    await fixer.setup(fixers);
  } catch (error) {
    console.error(error);
  }
})).then(() => {
  console.log('Success:', JSON.stringify(fixers, null, 2));
});

// TODO register autofixers into tiers

// Tier 0

'find . -not -iwholename "*.git*" -type f -print0 | xargs -0 perl -pi -e "s/\\s+$//"'

'./mach lint .'

'./mach static-analysis check .'

'performance-faster-string-find'

'git submodule foreach git fetch && git submodule update --remote';

// Tier 1

// Tier 2

'android-cloexec-accept'
'android-cloexec-accept4'
'android-cloexec-creat'
'android-cloexec-dup'
'android-cloexec-epoll-create'
'android-cloexec-epoll-create1'
'android-cloexec-fopen'
'android-cloexec-inotify-init'
'android-cloexec-inotify-init1'
'android-cloexec-memfd-create'
'android-cloexec-open'
'android-cloexec-socket'

// Tier 3

