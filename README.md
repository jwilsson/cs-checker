# cs-checker
A tool to compare JavaScript code styles with the help of JSCS.

Made as part of the final project for a University Diploma at [Linnaeus University](http://lnu.se/).

The goal is to check the top 100 starred repos on GitHub and compare their code styles. For a list of rules that are checked, see `rules.json`.

## Usage
First of all, pull down all dependencies with `npm install`.

Then, in an attempt to speed things up (and avoid hitting GitHub API limits) we first fetch a list of all repos to clone and save that to disk.

Perform this first action by running `node setup.js`.

When done, and on all consecutive runs, simply run `./check.sh` and a report will be generated with all the violated rules.

*Note: You'll probably need to add the correct permissions to check.sh before running it, i.e.*

```bash
(sudo) chmod +x check.sh
```
