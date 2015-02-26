var gulp = require('./');

var del = require('del');
var browserSync = require('browser-sync');
var lessSourcemap = require('gulp-less-sourcemap');
var runSequence = require('run-sequence');

var reload = browserSync.reload;

function ThemeDevelopment(theme, branch) {
	this.setTheme(theme);
	this.setBranch(branch);
}

ThemeDevelopment.prototype.getTheme = function () {
  return process.env.KULER_CURRENT_THEME;
};

ThemeDevelopment.prototype.setTheme = function (theme) {
	this.theme = theme;
};

ThemeDevelopment.prototype.getBranch = function () {
	return process.env.KULER_CURRRENT_BRANCH;
};

ThemeDevelopment.prototype.setBranch = function (branch) {
	this.branch = branch;
};

ThemeDevelopment.prototype.getPaths = function () {
	var themeBase = this.getBranch() + '/src/catalog/view/theme/'+ this.getTheme() + '/';

	return {
		build: this.getBranch() + '/build',
		less: themeBase +'less/{stylesheet,rtl}.less',
		stylesheet: themeBase + 'stylesheet',
		footerTpl: themeBase + 'template/common/footer.tpl'
	};
};

ThemeDevelopment.prototype.getWildcards = function () {
  var themeBase = this.getBranch() + '/src/catalog/view/theme/'+ this.getTheme() + '/';

  return wildcards = {
    allFiles: this.getBranch() + '/src/**/*',
    stylesheet: themeBase + 'stylesheet/*.css',
    less: themeBase + 'less/*.less',
    skinStylesheet: '!' + themeBase + 'stylesheet/' + this.getTheme() +'_skin*',
    template: themeBase + 'template/*/*.tpl',
    dataFolder: themeBase + 'data/*'
  };
};

var currentThemeDevelopment = new ThemeDevelopment('tempus', 'v2');

gulp.task('less', function () {
  gulp.src(currentThemeDevelopment.getPaths().less)
    .pipe(lessSourcemap({
      sourceMapRootpath: '../less'
    }))
    .on('error', function (err) {
    	console.log(err.message);
    })
    .pipe(gulp.dest(currentThemeDevelopment.getPaths().stylesheet));
});

gulp.task('browser-sync', function() {
    browserSync.use(require("bs-snippet-injector"), {
      file: currentThemeDevelopment.getPaths().footerTpl
    });

    browserSync({
      files: currentThemeDevelopment.getWildcards().stylesheet
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('copy', function() {
  return gulp.src([currentThemeDevelopment.getWildcards().allFiles, currentThemeDevelopment.getWildcards().skinStylesheet])
    .pipe(gulp.dest(currentThemeDevelopment.getPaths().build));
});

gulp.task('clean', function (cb) {
	del([currentThemeDevelopment.getPaths().build], cb);
});

gulp.task('serve', ['browser-sync'], function () {
	gulp.watch(currentThemeDevelopment.getWildcards().less, ['less']);
	gulp.watch(currentThemeDevelopment.getWildcards().template, ['bs-reload']);
	gulp.watch(currentThemeDevelopment.getWildcards().dataFolder, ['bs-reload']);
});

gulp.task('build', ['clean'], function (cb) {
  runSequence(['less', 'copy'], cb);
});