// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const minimist = require('minimist');
const exec = require('./lib/exec');

const argv = minimist(process.argv.slice(2));

// Parse tiers.
const tiers = String(argv.tiers || 0).split(',').map(tier => parseInt(tier, 10)).sort();

// Detect and register available autofixers.
const fixers = [ [], [], [], [] ];
Promise.all([
  require('./fixers/codespell'),
  require('./fixers/trailing-spaces'),
  require('./fixers/clang-tidy'),
].map(async (fixer) => {
  try {
    await fixer.register(fixers);
  } catch (error) {
    console.error(error);
  }
})).then(async () => {
  let branch = null;
  try {
    branch = await exec('git branch | grep \\* | cut -d " " -f2');
    branch = branch.trim();
  } catch (error) {
    if (argv.branches) {
      // Can't create branches without a base branch.
      throw error;
    }
  }

  for (const tier of tiers) {
    if (!Array.isArray(fixers[tier])) {
      const availableTiers = [...new Array(fixers.length).keys()];
      console.error(`Unknown tier: ${tier} (available tiers: ${availableTiers})`);
      continue;
    }

    const fixersCount = fixers[tier].length;
    console.log(`Tier ${tier} (${fixersCount} fixer${fixersCount === 1 ? '' : 's'})`);

    for (const fixer of fixers[tier]) {
      console.log(`Fixer "${fixer.id}"`);
      if (argv.branches) {
        console.log('EXEC', `git checkout -b autofix-${fixer.id} ${branch}`);
      }

      console.log('EXEC', fixer.cmd);
      console.log('EXEC', `git commit -am "Autofix: ${fixer.id}"`);

      if (argv.branches) {
        console.log('EXEC', `git checkout ${branch}`);
      }
    }
  }
}).catch(error => {
  console.error(error);
  process.exit(1);
});

// Tier 0

'find . -not -iwholename "*.git*" -type f -print0 | xargs -0 perl -pi -e "s/\\s+$//"'

'./mach lint .'

'./mach static-analysis check .'

'performance-faster-string-find'

'git submodule foreach git fetch && git submodule update --remote'

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
