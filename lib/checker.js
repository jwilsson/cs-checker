var childProcess = require('child_process');
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
    data = JSON.stringify(data, null, 4);

    fs.writeFile(reportPath, data);
};

module.exports.fetch = function (url, dest) {
    var options = {
        cwd: dest
    };

    console.log('Trying to fetch ' + url);

    try {
        childProcess.execSync('git clone --depth 1 ' + url, options);
    } catch (e) {
        // We've probably already cloned this repo, try to pull it instead

        try {
            console.log('Repo already cloned, pulling instead.');

            childProcess.execSync('git pull', options);
        } catch (e) {}
    }
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
        var files;

        path = fullPath + '/' + path;
        files = glob.sync(path + '/**/*.js');

        if (files.length > 1) {
            srcPath = path;

            return true;
        }

        return false;
    });

    // Nothing found, check root
    if (!srcPath) {
        srcPath = fullPath + '/';
    }

    console.log('Checking ' + name);

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

        console.log('Writing report for ' + name);
        writeReport(result);
    });
};
