var request = require('request');
var checker = require('./lib/checker');
var fs = require('fs');

var jscsConfig = JSON.parse(fs.readFileSync(__dirname + '/rules.json', 'utf8'));
var options = {
    url: 'https://api.github.com/search/repositories?q=language:JavaScript&sort=stars&per_page=100',
    headers: {
        'User-Agent': 'cs-checker by jwilsson'
    }
};

request(options, function (error, response, body) {
    body = JSON.parse(body);

    body.items.forEach(function (repo) {
        checker.check(repo, jscsConfig)
    });
});
