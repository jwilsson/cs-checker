var childProcess = require('child_process');
var rimraf = require('rimraf');
var JSCS = require('jscs');
var Vow = require('vow');
var os = require('os');
var fs = require('fs');

var tmpDir = os.tmpDir().replace(/\/$/, '');

module.exports.check = function (repo, config) {
    var srcPaths = ['src', 'lib', 'js', repo.name];
    var fullPath = tmpDir + '/' + repo.name;
    var fileCount = 0;
    var options = {
        cwd: tmpDir
    };

    console.log('Cloning ' + repo.clone_url);

    // Just clone the latest commit since that's all we need
    childProcess.exec('git clone --depth 1 ' + repo.clone_url, options, function () {
        var jscs = new JSCS(config);
        var errorCount = {};
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
            srcPath = fullPath + '/';
        }

        // Check each file for reported errors
        Vow.allResolved(jscs.checkPath(srcPath)).spread(function () {
            [].forEach.call(arguments, function (promise) {
                var errors;

                fileCount++;

                errors = promise.valueOf();
                errors = errors.getErrorList().map(function (error) {
                    return error.rule;
                });

                errors.some(function (error) {
                    if (!errorCount[error]) {
                        errorCount[error] = 0;
                    }

                    errorCount[error]++;

                    return true;
                });
            });

            console.log(errorCount);
            console.log(fileCount);

            // Clean up
            console.log('Cleaning up ' + repo.name);

            rimraf(fullPath, function () {
                console.log('Cleaned up ' + repo.name);
            });
        });
    });
};
