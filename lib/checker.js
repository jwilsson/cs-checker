var childProcess = require('child_process');
var rimraf = require('rimraf');
var jscs = require('jscs');
var fs = require('fs');
var os = require('os');

var tmpDir = process.cwd() + '/'; //os.tmpDir();

module.exports.check = function (repo) {
    var fullPath = tmpDir + repo.name;
    var options = {
        cwd: tmpDir
    };

    // Clone the repo
    childProcess.exec('git clone ' + repo.clone_url, options, function () {
        var config = {};

        console.log(config);

        rimraf(fullPath, function () {});
    });
};
