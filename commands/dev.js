var Command = require('ronin').Command;
var gulp = require('../lib/gulp');

require('../lib/gulp/theme_tasks');

var Dev = Command.extend({
  desc: 'Develop theme',
  
  run: function () {
    gulp.start.apply(gulp, ['serve']);
  }
});

module.exports = Dev;
