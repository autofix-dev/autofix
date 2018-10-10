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

Preview all the commands this would run, but don't actually do anything:

```bash
autofix --branches --push=myremote --dry
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

- [ ] `DIRECTORY`: Run autofix in a particular directory (defaults to `.`).
- [ ] `REPOSITORY`: Clone a Git repository, then run autofix in it.

OPTIONS:

- [x] `--dry`: Simulate without actually running any fix commands
- [x] `--branches`: Commit fixes of different types into different branches (e.g. `autofix-codespell`)
- [x] `--tiers=0,1,2`: Choose which types of bugs should be autofixed (see details about tiers below)
- [x] `--verbose`: Log additional information to the console (e.g. for troubleshooting `autofix` bugs)
- [x] `--push=REMOTE`: Push fixes to a given GitHub remote (e.g. your GitHub username)
- [ ] `--pull-request`: Automatically open pull requests with pushed branches
- [ ] `--circle-ci`: Run this autofix weekly on CircleCI (adds a `.circleci/config.yml` file)


## Types of bugs that can be fixed

Tier 0 (no rework needed):
- [x] Remove trailing whitespace (requires `find`, `xargs` and `perl`)
- [x] Fix typos & spelling mistakes (requires [codespell](https://github.com/codespell-project/codespell/))
- [ ] Update Git submodules

Tier 1 (some rework might be needed):
- [ ] TODO

Tier 2 (experimental, use with caution):
- [ ] Fix C++ bugs with `clang-tidy` (requires [clang-tidy](http://clang.llvm.org/extra/clang-tidy/))
- [ ] Fix Rust bugs with `clippy` (requires [rust-clippy](https://github.com/rust-lang-nursery/rust-clippy/))

Tier 3 (you probably don't want to run these):
- [ ] TODO
