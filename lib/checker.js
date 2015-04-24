var childProcess = require('child_process');
var os = require('os');

var tmpDir = os.tmpDir;

module.exports.check = function (repo) {
    childProcess.execSync('git clone ' + repo.clone_url, {
        cwd: tmpDir
    });
};
