var checker = require('./lib/checker');
var fs = require('fs');

var argv = require('yargs').argv;

var jscsConfig = JSON.parse(fs.readFileSync(__dirname + '/rules.json', 'utf8'));
var destDir = process.cwd() + '/data/repos';

fs.readFile(process.cwd() + '/data/repos.json', { encoding: 'utf8' }, function (err, data) {
    if (err) {
        throw err;
    }

    data = JSON.parse(data);
    repo = data[argv.index];

    checker.fetch(repo.url, destDir);
    checker.check(repo.name, jscsConfig, destDir);
});
