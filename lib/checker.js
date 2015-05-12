var childProcess = require('child_process');
var rimraf = require('rimraf');
var JSCS = require('jscs');
var Vow = require('vow');
var os = require('os');
var fs = require('fs');

var tmpDir = os.tmpDir();

module.exports.check = function (repo, config) {
    var srcPaths = ['lib', 'js', 'src', repo.name];
    var fullPath = tmpDir + '/' + repo.name;
    var options = {
        cwd: tmpDir
    };

    console.log('Cloning ' + repo.clone_url);

    // Just clone the latest commit since that's all we need
    childProcess.exec('git clone ' + repo.clone_url, options, function () {
        var jscs = new JSCS(config);
        var srcPath;

        jscs.registerDefaultRules();
        jscs.configure(config);

        console.log('Checking ' + repo.name);

        // Try and find the JS source
        srcPaths.some(function (path) {
            if (fs.existsSync(fullPath + '/' + path)) {
                srcPath = fullPath + '/' + path;

                return true;
            }

            return false;
        });

        // Nothing found, check root
        if (!srcPath) {
            srcPath fullPath + '/';
        }

        // Check each file for reported errors
        Vow.allResolved(jscs.checkPath(srcPath)).spread(function () {
            [].forEach.call(arguments, function (promise) {
                var errors;

                errors = promise.valueOf();
            });

            rimraf(fullPath, function () {
                console.log('Cleaned up ' + repo.name);
            });
        });
    });
};
