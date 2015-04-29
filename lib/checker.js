var childProcess = require('child_process');
var rimraf = require('rimraf');
var JSCS = require('jscs');
var os = require('os');

var tmpDir = os.tmpDir();

module.exports.check = function (repo, config) {
    var fullPath = tmpDir + repo.name;
    var options = {
        cwd: tmpDir
    };

    console.log('Cloning ' + repo.clone_url);

    // Just clone the latest commit since that's all we need
    childProcess.exec('git clone --depth 1 ' + repo.clone_url, options, function () {
        var jscs = new JSCS(config);

        console.log('Checking ' + repo.name);

        jscs.checkPath(fullPath);

        rimraf(fullPath, function () {
            console.log('Cleaned up ' + repo.name);
        });
    });
};
