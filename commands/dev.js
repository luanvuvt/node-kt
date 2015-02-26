var Command = require('ronin').Command;
var gulp = require('../lib/gulp');

gulp.task('default', function () {
	console.log('default');
});

var Dev = Command.extend({
  desc: 'Develop theme',
  
  run: function () {
    gulp.start.apply(gulp, ['default']);
  }
});

module.exports = Dev;
