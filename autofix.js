// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const fs = require('fs');
const minimist = require('minimist');
const exec = require('./lib/exec');

const argv = minimist(process.argv.slice(2));

// Parse tiers (e.g. --tiers=0,1,2 gives [0, 1, 2]).
const tiers = String(argv.tiers || 0).split(',').map(tier => parseInt(tier, 10)).sort();

// Detect and register available fixers.
const fixers = [ [], [], [], [] ];
Promise.all(fs.readdirSync(`${__dirname}/fixers`).map(path => require(`${__dirname}/fixers/${path}`)).map(async (fixer) => {
  try {
    await fixer.register(fixers);
  } catch (error) {
    // If a fixer fails to register itself, log the error but don't exit.
    console.error(`Failed to register fixer ${fixer.id}`, argv.verbose ? error : '(use --verbose to see error)');
  }
})).then(async () => {
  // Ensure the current Git status is clean.
  const status = await exec('git status --porcelain', true);
  if (status.trim().length > 0) {
    throw `You have uncommitted changes. Aborting!\n${status}`;
  }

  // Try to detect the current Git branch.
  let baseBranch = null;
  try {
    baseBranch = await exec('git branch | grep \\* | cut -d " " -f2', true);
    baseBranch = baseBranch.trim();
  } catch (error) {
    if (argv.branches || argv.push) {
      // Can't create branches or push without a current Git branch!
      throw error;
    }
  }

  // Determine whether any commits should be pushed to a remote Git repository.
  let pushRemote = null;
  if (argv.push) {
    // If --push=myremote was passed, push to that remote.
    pushRemote = argv.push;
  } else if (argv['pull-request']) {
    // If --push=myremote was not passed, but --pull-request was passed, push to 'origin' by default.
    pushRemote = 'origin';
  }

  // Execute all fixers by enabled tier.
  for (const tier of tiers) {
    if (!Array.isArray(fixers[tier])) {
      // This is not a valid tier.
      const availableTiers = [...new Array(fixers.length).keys()]; // [0, 1, 2, ...]
      console.error(`Unknown tier: ${tier} (available tiers: ${availableTiers})`);
      continue;
    }

    const fixersCount = fixers[tier].length;
    console.log(`Tier ${tier} has ${fixersCount} fixer${fixersCount === 1 ? '' : 's'}:`);

    for (const fixer of fixers[tier]) {
      console.log(`Running fixer "${fixer.id}"`);

      const fixBranch = argv.branches ? `autofix-${fixer.id}` : baseBranch;
      if (argv.branches) {
        // If --branches was passed, create a dedicated branch for this fixer.
        await exec(`git checkout -b ${fixBranch} ${baseBranch} 2>&1`);
      }

      // Try to run the fixer's command.
      try {
        await exec(fixer.cmd);
      } catch (error) {
        console.error(`Failed to run fixer ${fixer.id}: ${fixer.cmd}`, error);
      }

      // Attempt to commit any changes (will fail if there is no change).
      let committed = false;
      try {
        await exec(`git commit -am "Autofix: ${fixer.id}"`);
        committed = true;
      } catch (error) {
        if (argv.verbose) {
          console.error(error);
        }
        console.log('  No fixes to commit')
      }

      if (committed && pushRemote) {
        // If fixes were committed, and --push=myremote or --pull-request were passed, push to the appropriate remote.
        await exec(`git push ${pushRemote} ${fixBranch} 2>&1`);

        if (argv['pull-request']) {
          // If --pull-request was passed, open a Pull Request from the pushed branch to the upstream repository's default branch.
          await exec(`hub pull-request --head "${pushRemote}:${fixBranch}" --no-edit`);
        }
      }

      if (argv.branches) {
        // If --branches was passed, return to the original Git branch.
        await exec(`git checkout ${baseBranch} 2>&1`);
        if (!committed) {
          // If no fixes were committed, delete the dedicated branch again.
          await exec(`git branch -D ${fixBranch}`)
        }
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

'codespell -w 2>/dev/null'

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
