var request = require('request');
var mkdirp = require('mkdirp');
var fs = require('fs');

var destDir = process.cwd() + '/data/repos';
var options = {
    url: 'https://api.github.com/search/repositories?q=language:JavaScript&sort=stars&per_page=100',
    headers: {
        'User-Agent': 'cs-checker by jwilsson'
    }
};

// Create required files
mkdirp.sync(destDir);
fs.writeFileSync(process.cwd() + '/data/report.json', '{}');

request(options, function (error, response, body) {
    var data = [];

    body = JSON.parse(body);
    body.items.forEach(function (repo) {
        data.push({
            name: repo.name,
            url: repo.clone_url
        });
    });

    data = JSON.stringify(data, null, 4);

    fs.writeFileSync(process.cwd() + '/data/repos.json', data);
});
