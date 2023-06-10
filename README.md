# Autofix

[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-908a85?logo=gitpod)](https://gitpod.io/#https://github.com/autofix-dev/autofix)
[![NPM version](https://img.shields.io/npm/v/autofix)](https://www.npmjs.com/package/autofix)

Automatically fix all software bugs.


## Examples

Automatically fix bugs in the current directory:

```bash
autofix
```

Preview all the commands this would run, but don't actually do anything:

```bash
autofix --dry
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


## Try it online

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/autofix-dev/autofix)


## Try it locally

If you have [npm](https://www.npmjs.com), you can run `autofix` via `npx`:

```bash
npx autofix
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
- [x] `--pull-request`: Automatically open pull requests with pushed commits (requires [hub](https://github.com/github/hub), implies `--push=origin` if unspecified)
- [x] `--pull-request-description=FILENAME`: Customize pull request descriptions by providing a markdown file (use with `--pull-request`)
- [x] `--branch-suffix=SUFFIX`: Add a common suffix to generated branch names (i.e. `autofix-codespell-SUFFIX`)
- [x] `--signoff`: Use Git's `--signoff` (or `-s`) feature when creating commits


## Types of bugs that can be fixed

Tier 0 (default - no rework needed):
- [x] Remove trailing whitespace (uses `git`, `xargs` and `sed`)
- [x] Update pinned pyenv tool versions in Dockerfiles (requires `pyenv`)
- [x] Update pinned nvm tool versions in Dockerfiles (requires `nvm`)
- [x] Update pinned sdkman tool versions in Dockerfiles (requires [sdkman](https://github.com/sdkman/sdkman-cli))
- [x] Update pinned rr versions in Dockerfiles
- [x] Update some pinned Go module versions in Dockerfiles
- [x] Update Git submodules

Tier 1 (some rework might be needed):
- [x] Fix typos & spelling mistakes (requires [codespell](https://github.com/codespell-project/codespell/))

Tier 2 (experimental, use with caution):
- [x] Fix C++ bugs with `clang-tidy` (requires [clang-tidy](http://clang.llvm.org/extra/clang-tidy/))
- [ ] Fix Rust bugs with `clippy` (requires [rust-clippy](https://github.com/rust-lang-nursery/rust-clippy/))

Tier 3 (you probably don't want to run these):
- [ ] TODO


## Custom fixers

You can also implement your own fixers (similar to the ones found in the [./fixers/](./fixers/) directory) and commit them to your repository under a `.autofix/fixers/` directory. Autofix will automatically pick them up; run them on your codebase; and commit new fixes when relevant.
