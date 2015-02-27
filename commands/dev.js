var Command = require('ronin').Command;
var Gulp = require('../lib/gulp');
var themeTaskInit = require('../lib/gulp/themeTasks');

var Dev = Command.extend({
  desc: 'Develop theme',
  
  options: {
      branch: {
          type: 'string',
          alias: 'b'
      }
  },
  
  run: function (branch) {
  	if (!branch) {
  	    throw new Error('--branch is required. For example: kt dev -b v2');
  	}

  	var themeData = require(process.cwd() + '/theme.json');

  	var gulp = new Gulp();
  	themeTaskInit(gulp, themeData.theme, branch);

    gulp.start('serve');
  }
});

module.exports = Dev;
