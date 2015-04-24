var request = require('request');

var options = {
    url: 'https://api.github.com/search/repositories?q=language:JavaScript&sort=stars&per_page=50',
    headers: {
        'User-Agent': 'cs-checker by jwilsson'
    }
};

request(options, function (error, response, body) {
    var repos = JSON.parse(body);

    console.log(repos);
});
