var childProcess = require('child_process');
var rimraf = require('rimraf');
var jscs = require('jscs');
var fs = require('fs');
var os = require('os');

var tmpDir = os.tmpDir();

module.exports.check = function (repo) {
    var fullPath = tmpDir + repo.name;
    var options = {
        cwd: tmpDir
    };

    // Just clone the latest commit since that's all we need
    childProcess.exec('git clone --depth 1 ' + repo.clone_url, options, function () {
        var config = {};

        console.log('Cloning ' + repo.clone_url, fullPath);

        rimraf(fullPath, function () {});
    });
};
