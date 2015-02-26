var Command = require('ronin').Command;
var gulp = require('../lib/gulp');

var Build = Command.extend({
  desc: 'Build theme',

  options: {
      branch: {
          type: 'string',
          alias: 'b'
      }
  },
  
  run: function (branch) {
  	if (!branch) {
  	    throw new Error('--branch is required. For example: kt build -b v2');
  	}

  	require('../lib/gulp/theme_tasks');

  	var themeData = require(process.cwd() + '/theme.json');

  	process.env.KULER_CURRENT_THEME = themeData.theme;
  	process.env.KULER_CURRRENT_BRANCH = branch;

    gulp.start.apply(gulp, ['build']);
  }
});

module.exports = Build;
