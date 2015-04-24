var request = require('request');
var checker = require('./lib/checker');

var options = {
    url: 'https://api.github.com/search/repositories?q=language:JavaScript&sort=stars&per_page=50',
    headers: {
        'User-Agent': 'cs-checker by jwilsson'
    }
};

request(options, function (error, response, body) {
    body = JSON.parse(body);

    body.items.forEach(checker.check);
});
