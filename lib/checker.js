var childProcess = require('child_process');
var rimraf = require('rimraf');
var merge = require('lodash.merge');
var glob = require('glob');
var JSCS = require('jscs');
var Vow = require('vow');
var fs = require('fs');

var writeReport = function (data) {
    var reportPath = process.cwd() + '/report.json';
    var oldData = fs.readFileSync(reportPath, {
        encoding: 'utf8'
    });

    oldData = JSON.parse(oldData);
    data = merge(oldData, data);
    data = JSON.stringify(data);

    fs.writeFile(reportPath, data);
};

module.exports.fetch = function (url, dest) {
    var options = {
        cwd: dest
    };

    console.log('Cloning ' + url);

    childProcess.execSync('git clone --depth 1 ' + url, options);
};

module.exports.check = function (name, config, dest) {
    var srcPaths = ['src', 'lib', 'js', name];
    var fullPath = dest + '/' + name;
    var jscs = new JSCS(config);
    var errorCount = {};
    var fileCount = 0;
    var srcPath;

    jscs.registerDefaultRules();
    jscs.configure(config);

    // Try and find the JS source
    srcPaths.some(function (path) {
        var files = glob.sync(fullPath + '/' + path + '/**/*.js');

        return !!files.length;
    });

    // Nothing found, check root
    if (!srcPath) {
        srcPath = fullPath + '/';
    }

    // Check each file for reported errors
    Vow.allResolved(jscs.checkPath(srcPath)).spread(function () {
        var result = {};

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

        result[name] = merge(errorCount, {
            files: fileCount
        });

        writeReport(result);

        console.log('Cleaning up ' + name);
        rimraf.sync(fullPath);


    });
};
