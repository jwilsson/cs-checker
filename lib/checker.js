var stripJsonComments = require('strip-json-comments');
var childProcess = require('child_process');
var fs = require('fs');
var os = require('os');

var tmpDir = os.tmpDir();

var findConfig = function (path) {
    var config = null;

    /*
     * JSHint looks for a jshintConfig property first so we'll do it too.
     * See https://github.com/jshint/jshint/blob/928f19dbf3378734ef2119689dc51acfa37edfc2/src/cli.js#L511
     */
    if (fs.existsSync(path + '/package.json')) {
        config = fs.readFileSync(path + '/package.json', {
            encoding: 'utf8'
        });

        config = stripJsonComments(config);
        config = JSON.parse(config).jshintConfig;
    }

    // No jshintConfig property found, let's look for a .jshintrc
    if (!config && fs.existsSync(path + '/.jshintrc')) {
        config = fs.readFileSync(path + '/.jshintrc', {
            encoding: 'utf8'
        });

        config = stripJsonComments(config);

        return JSON.parse(config);
    }

    return config;
};

module.exports.check = function (repo) {
    var fullPath = tmpDir + repo.name;
    var options = {
        cwd: tmpDir
    };

    // Clone the repo
    childProcess.exec('git clone ' + repo.clone_url, options, function () {
        var config = findConfig(fullPath);

        console.log(config);
    });
};
