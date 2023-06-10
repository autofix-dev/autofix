// Copyright © 2018 Jan Keromnes.
// The following code is covered by the MIT license.

const fs = require('fs');
const minimist = require('minimist');
const exec = require('./lib/exec');

const argv = minimist(process.argv.slice(2));

// Parse tiers (e.g. --tiers=0,1,2 gives [0, 1, 2]).
const tiers = String(argv.tiers || 0).split(',').map(tier => parseInt(tier, 10)).sort();

// Detect and register available fixer modules.
const fixers = [ [], [], [], [] ];
console.log(`Registering fixer modules`);
const loadFixers = (directory) => {
  return !fs.existsSync(directory) ? [] :
    fs.readdirSync(directory).map(fixerPath => Object.assign(require(`${directory}/${fixerPath}`), { path: fixerPath }));
}
const coreFixers = loadFixers(`${__dirname}/fixers`);
const customFixers = loadFixers(`${process.cwd()}/.autofix/fixers`);
Promise.all([...coreFixers, ...customFixers].map(async (fixer) => {
  try {
    if (argv.verbose) {
      console.log(`  Registering ${fixer.path}...`);
    }
    await fixer.register(fixers);
  } catch (error) {
    // If a fixer fails to register itself, log the error but don't exit.
    console.error(`  Failed to register fixer module ${fixer.path}`, argv.verbose ? error : '(use --verbose to see error)');
  }
})).then(async () => {
  console.log('Running fixers');

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

      const fixBranch = argv.branches ? `autofix-${fixer.id}${argv['branch-suffix'] ? '-' + argv['branch-suffix'] : ''}` : baseBranch;
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

      // Undo any changes made to files covered by .gitignore.
      try {
        await exec(`for file in $(git ls-files -ci --exclude-standard) ; do git checkout $file ; done`);
      } catch (error) {
        if (argv.verbose) {
          console.error(error);
        }
      }

      // Attempt to commit any changes (will fail if there is no change).
      let committed = false;
      const commitMessage = `Autofix: ${fixer.id}`;
      try {
        await exec(`git commit -a${argv.signoff ? 's' : ''}m "${commitMessage}" 2>/dev/null`);
        committed = true;
        if (!argv.dry) {
          console.log(`  Fixes committed!`);
        }
      } catch (error) {
        if (argv.verbose) {
          console.error(error);
        }
        console.log('  No fixes to commit')
      }

      if (committed && pushRemote) {
        // If fixes were committed, and --push=myremote or --pull-request were passed, push to the appropriate remote.
        await exec(`git push ${pushRemote} ${fixBranch} 2>&1`);

        // If --pull-request was passed, open a Pull Request from the pushed branch to the upstream repository's default branch.
        if (argv['pull-request']) {
          let pullRequestFile = commitMessage;
          // If --pull-request-description was passed, use the provided markdown file.
          if (argv['pull-request-description']) {
            pullRequestFile += '\n\n' + fs.readFileSync(argv['pull-request-description'], 'utf-8');
          }
          await exec(`hub pull-request --head "${pushRemote}:${fixBranch}" --file - <<'PR_END'\n${pullRequestFile}\nPR_END\n`);
        }
      }

      if (argv.branches) {
        // If --branches was passed, return to the original Git branch.
        await exec(`git checkout ${baseBranch} 2>&1`);
        // Also return any Git submodules to their original state.
        await exec(`git submodule update --force`);
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
