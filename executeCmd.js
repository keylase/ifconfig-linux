'use strict'

var Promise = require('bluebird').Promise;
var exec = require('child_process').exec;
var parser = require('./ifconfig-parser');

// retuen a promise(text)
function executeIfconfig() {
    var cmd = 'ip -s addr';

    return new Promise(function (resolve, reject) {
        exec(cmd, function(error, stdout, stderr) {
		console.log(stdout);
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    }).then(parser);
}

module.exports = executeIfconfig;
