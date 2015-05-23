var _ = require('lodash'),
    chalk = require('chalk'),
    path = require('path');

module.exports = function pipeGrunt(grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  function parseTaskInfo(input) {
    var splitName;

    if (_.isObject(input)) {
      return {
        task: input.task,
        target: input.target,
        full: _.compact([input.task, input.target]).join(':'),
        config: input.config || {},
        files: input.files
      };
    } else {
      splitName = input.split(':');

      return {
        task: splitName[0],
        target: splitName[1],
        full: input,
        config: undefined,
        files: undefined
      };
    }
  };

  function buildNewConfig(taskInfo) {
    var currentConfig = grunt.config(_.compact([taskInfo.task, taskInfo.target]));

    return _.merge(
      {},
      currentConfig,
      taskInfo.config
    );
  };

  function buildFileBlock(taskInfo, srcs, pipeTarget) {
    var tempDir = '.' + [pipeTarget, taskInfo.task].join('-'),
        newFiles,
        normalizedNewFiles,
        defaultFilesObj,
        srcsCwd = path.dirname(srcs[0]),
        srcsBasenames = _.map(srcs, path.basename);

    defaultFilesObj = {
      expand: true,
      cwd: srcsCwd,
      src: srcsBasenames,
      dest: tempDir
    };

    // Build new file object
    if (taskInfo.files) {
      if (_.isArray(taskInfo.files)) {
        newFiles = {
          files: _.map(taskInfo.files, function mapTaskFiles(fileObj) {
              var mappedSrcs,
                  dest;

              mappedSrcs = _.chain([fileObj.src]).flatten().map(function(src) {
                var base = path.basename(src);

                if (_.contains(srcsBasenames, base)) {
                  return srcsCwd + '/' + base;
                } else {
                  return null;
                }
              }).compact().value();

              dest = tempDir;
              if (fileObj.dest) {
                dest += '/' + path.basename(fileObj.dest);
              }

              grunt.file.write(dest, '');

              return {
                src: mappedSrcs,
                dest: dest
              };
            })
        };
      } else if (_.isObject(taskInfo.files)) {
        if (taskInfo.files.dest) {
        // If a dest is set, then everything is going to one place (concat)
          newFiles = {
            src: srcs,
            dest: tempDir + '/' + path.basename(taskInfo.files.dest)
          };
        } else {
          newFiles = _.extend({}, taskInfo.files, defaultFilesObj);
        }
      } else if (_.isString(taskInfo.files))  {
        newFiles = {
          src: srcs,
          dest: tempDir + '/' + taskInfo.files
        };
      }
    }

    if (!newFiles) {
      newFiles = defaultFilesObj;
    }

    normalizedNewFiles = grunt.task.normalizeMultiTaskFiles(newFiles);

    _.each(normalizedNewFiles, function(file) {
      // Touch the file, to hold its place
      grunt.file.write(file.dest, '');
    });

    return normalizedNewFiles;
  };

  function copyAndClean(files, pipeTarget) {
    var newConfig = {
          clean: {},
          copy: {}
        };

    // One final task to move files to ultimate destination
    newConfig.clean[pipeTarget + '-dest'] = [files.dest];

    newConfig.copy[pipeTarget] = {
      files: [files]
    };
    newConfig.clean[pipeTarget + '-temps'] = ['.pipegrunt-*/'];

    grunt.config.merge(newConfig);

    grunt.task.run([
      'clean:' + pipeTarget + '-dest',
      'copy:' + pipeTarget,
      'clean:' + pipeTarget + '-temps'
    ]);
  };

  function pipeTasks(taskList, originalFiles) {
    var pipeTarget = ['pipegrunt', _.now()].join('-'),
        inputFiles,
        outputFiles,
        finalFiles;

    inputFiles = _.chain(grunt.task.normalizeMultiTaskFiles(originalFiles))
      .pluck('src')
      .flatten()
      .value();

    taskList = _.flatten([taskList]);

    if (taskList.length) {
      // Execute tasks
      outputFiles = _.reduce(taskList, function(srcs, task) {
        var taskInfo = parseTaskInfo(task),
            newConfig = {},
            newFiles;

        newConfig[taskInfo.task] = {};
        newConfig[taskInfo.task][pipeTarget] = buildNewConfig(taskInfo);

        if (taskInfo.files !== false && srcs.length) {
          newFiles = buildFileBlock(taskInfo, srcs, pipeTarget);
          newConfig[taskInfo.task][pipeTarget].files = newFiles;
        }

        // Apply cloned config
        grunt.config.merge(newConfig);

        // Execute the task
        grunt.task.run(taskInfo.task + ':' + pipeTarget);

        grunt.verbose.writeln('Piping ' + taskInfo.full + ' task as ' + pipeTarget);

        if (!!newFiles) {
          return _.pluck(newFiles, 'dest');
        } else {
          return _.clone(srcs);
        }
      }, inputFiles);

      finalFiles = {
        expand: true,
        cwd: path.dirname(outputFiles[0]),
        src: '**/*',
        dest: originalFiles.dest
      };
    } else {
      finalFiles = originalFiles;
    }

    copyAndClean(finalFiles, pipeTarget);
  };

  return {
    run: pipeTasks
  };
};
