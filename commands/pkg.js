var Command = require('ronin').Command;
var Gulp = require('../lib/gulp');
var themeTaskInit = require('../lib/gulp/themeTasks');
var Q = require('q');
var del = require('del');
var path = require('path');

var Package = Command.extend({
  desc: 'Package',
  
  run: function (manually) {
    var themeData = require(process.cwd() + '/theme.json');
    var packagesPath = path.join(process.cwd(), 'Packages');

    // Remove Packages folder
    del([packagesPath], function () {
      themeData.opencarts.forEach(function (item) {
        console.log('\n===================================\nBuild branch ' + item.name + '\n===================================\n');

        var itemPath = path.join(packagesPath, item.name, 'Theme_Package');
        var installPath = path.join(itemPath, 'Theme');

        var modulesPath = path.normalize(process.env['KULER_MODULES_PATH_' + item.folder]);
        var resourcePath = path.normalize(path.join(process.env['KULER_RESOURCE_PATH_' + item.folder], item.resource_path));

        var promises = [];

        // Build theme of branch
        var buildDefer = Q.defer();
        var buildGulp = new Gulp();
        themeTaskInit(buildGulp, themeData.theme, item.folder);
        buildGulp.start('build');

        buildGulp.on('stop', function () {
          buildDefer.resolve();
        });

        // Copy build folder to package
        Q.all([buildDefer.promise])
          .then(function () {
            var gulp = new Gulp();

            gulp
              .src(item.theme_path + '/**/*')
              .pipe(gulp.dest(installPath));
          });

        // Copy modules
        item.module_paths.forEach(function (module) {
          var gulp = new Gulp();

          gulp
            .src(path.join(modulesPath, module, '**', '*'))
            .pipe(gulp.dest(installPath));
        });

        // Copy resources
        var gulp = new Gulp();
        gulp
          .src([path.join(resourcePath, '**', '*'), '!' + path.join(resourcePath, '**', 'desktop.ini')])
          .pipe(gulp.dest(itemPath));
      });
    });


  }
});

module.exports = Package;