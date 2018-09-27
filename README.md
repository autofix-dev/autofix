# Autofix

Automatically fix all software bugs.

[![NPM version](https://img.shields.io/npm/v/autofix.svg)](https://www.npmjs.com/package/autofix)
[![NPM dependencies](https://img.shields.io/david/JanitorTechnology/autofix.svg)](https://david-dm.org/JanitorTechnology/autofix)


## Examples

Automatically fix bugs in the current directory:

```bash
autofix
```

Autofix bugs, commit fixes into separate branches, push branches to a GitHub remote:

```bash
autofix --branches --push=myremote
```

Autofix bugs in a GitHub repository:

```bash
autofix https://github.com/nodejs/node
```

Autofix bugs in a GitHub repository, commit fixes, and automatically send pull requests (requires [hub](https://github.com/github/hub)):

```bash
autofix https://github.com/nodejs/node --pull-request
```


## Install

With [npm](https://www.npmjs.com) do:

```bash
npm install -g autofix
```


## Command line options

```bash
autofix (DIRECTORY|REPOSITORY) [OPTIONS]
```

- [ ] `--branches`: Commit fixes of different types into different branches (e.g. `autofix-codespell`)
- [ ] `--circle-ci`: Run this autofix weekly on CircleCI (adds a `.circleci/config.yml` file)
- [ ] `--list`: List available autofixers instead of running them
- [ ] `--push=REMOTE`: Push fixes to a given GitHub remote (e.g. your GitHub username)
- [ ] `--pull-request`: Automatically open pull requests with pushed branches
- [ ] `--tiers=0,1,2`: Choose which types of bugs should be autofixed (see details about tiers below)


## Types of bugs that can be fixed

Tier 0 (no rework needed):
- [ ] Remove trailing whitespace (requires `find`, `xargs` and `perl`)
- [ ] Fix typos & spelling mistakes (requires [codespell](https://github.com/codespell-project/codespell/))
- [ ] Update Git submodules

Tier 1 (some rework might be needed):
- [ ]

Tier 2 (experimental, use with caution):
- [ ] Fix C++ bugs with `clang-tidy` (requires [clang-tidy](http://clang.llvm.org/extra/clang-tidy/))
- [ ] Fix Rust bugs with `clippy` (requires [rust-clippy](https://github.com/rust-lang-nursery/rust-clippy/))

Tier 3 (you probably don't want to run these):
- [ ]
