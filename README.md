# cs-checker
A tool to compare JavaScript code styles with the help of JSCS.

Made as part of the final project for a University Diploma at [Linnaeus University](http://lnu.se/).

The goal is to check the top 100 starred repos on GitHub and compare their code styles. For a list of rules that are checked, see `rules.json`.

## Usage
Currently there a nasty bash-script, `check.sh`, which simply loops from 1 to 100 and running the node module for each repo to check.
We're doing it like this since we ran in to some memory issues when trying to do everything from within node.

You'll probably need to add the correct permissions to `check.sh` before running it, i.e.
```bash
(sudo) chmod +x check.sh
```

and then

```bash
./check.sh
```

Grab a coffee, this will take a while.
