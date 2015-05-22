var fs = require('fs');

var argv = require('yargs').argv;

fs.readFile(process.cwd() + '/data/report.json', { encoding: 'utf8' }, function (err, data) {
    var result = 0;

    if (err) {
        throw err;
    }

    data = JSON.parse(data);

    for (repo in data) {
        if (data[repo][argv.rule]) {
            result++;
        }
    }

    console.log(result);
});
