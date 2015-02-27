var Command = require('ronin').Command;
var gulp = require('../lib/gulp');

var Package = Command.extend({
  desc: 'Package',
  
  run: function (manually) {
    var themeData = require(process.cwd() + '/theme.json');
  }
});

module.exports = Package;
