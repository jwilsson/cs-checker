var checker = require('./lib/checker');
var request = require('request');
var argv = require('yargs').argv;
var fs = require('fs');

var perPage = argv.count || 1;
var page = argv.page || 1;

var destDir = process.cwd() + '/repos';
var jscsConfig = JSON.parse(fs.readFileSync(__dirname + '/rules.json', 'utf8'));
var options = {
    url: 'https://api.github.com/search/repositories?q=language:JavaScript&sort=stars&per_page=' + perPage + '&page=' + page,
    headers: {
        'User-Agent': 'cs-checker by jwilsson'
    }
};

try {
    fs.mkdirSync(destDir);
} catch (e) {
    // The dir probably exists already
}

request(options, function (error, response, body) {
    body = JSON.parse(body);

    body.items.forEach(function (repo) {
        checker.fetch(repo.clone_url, destDir);
        checker.check(repo.name, jscsConfig, destDir);
    });
});
