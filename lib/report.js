var allErrors = [];
var counter = {};

module.exports.createReport = function (errors, rules) {
    // We're just interested in the violated rules
    errors = errors.map(function (error) {
        return error.rule;
    });

    // Create an array of all errors
    allErrors = allErrors.concat.apply(allErrors, errors);

    // Count the occurrence of each error
    allErrors.forEach(function (error) {
        if (!counter[error]) {
            counter[error] = 0;
        }

        counter[error]++;
    });

    console.log(counter);
};
