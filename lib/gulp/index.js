'use strict';

var util = require('util');
var Orchestrator = require('orchestrator');
var gutil = require('gulp-util');
var vfs = require('vinyl-fs');

var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var chalk = require('chalk');

// format orchestrator errors
function formatError(e) {
  if (!e.err) {
    return e.message;
  }

  // PluginError
  if (typeof e.err.showStack === 'boolean') {
    return e.err.toString();
  }

  // normal error
  if (e.err.stack) {
    return e.err.stack;
  }

  // unknown (string, number, etc.)
  return new Error(String(e.err)).stack;
}

function logEvents(gulpInst) {

  // total hack due to poor error management in orchestrator
  gulpInst.on('err', function () {
    failed = true;
  });

  gulpInst.on('task_start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    gutil.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');
  });

  gulpInst.on('task_stop', function (e) {
    var time = prettyTime(e.hrDuration);
    gutil.log(
      'Finished', '\'' + chalk.cyan(e.task) + '\'',
      'after', chalk.magenta(time)
    );
  });

  gulpInst.on('task_err', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.hrDuration);
    gutil.log(
      '\'' + chalk.cyan(e.task) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    );
    gutil.log(msg);
  });

  gulpInst.on('task_not_found', function (err) {
    gutil.log(
      chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
    );
    gutil.log('Please check the documentation for proper gulpfile formatting');
    process.exit(1);
  });
}

function Gulp() {
  Orchestrator.call(this);

  logEvents(this);
}
util.inherits(Gulp, Orchestrator);

Gulp.prototype.task = Gulp.prototype.add;

Gulp.prototype.src = vfs.src;
Gulp.prototype.dest = vfs.dest;
Gulp.prototype.watch = function (glob, opt, fn) {
  if (typeof opt === 'function' || Array.isArray(opt)) {
    fn = opt;
    opt = null;
  }

  // array of tasks given
  if (Array.isArray(fn)) {
    return vfs.watch(glob, opt, function () {
      this.start.apply(this, fn);
    }.bind(this));
  }

  return vfs.watch(glob, opt, fn);
};

module.exports = Gulp;