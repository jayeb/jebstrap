var _ = require('lodash');

module.exports = function(grunt) {
  var env = (grunt.option('env') === 'prod' ? 'prod' : 'dev');

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    name: '<%= pkg.name %>',
    default_filename: '<%= pkg.name.strtolower.replace(/[^A-Za-z0-9]/g, "_") %>',
    paths: {
        tmp: '.tmp',
        srv: '.' + env + '_srv',
        working: 'app'
      },


    // File and directory manipulation
    clean: {
        tmp: ['<%= paths.tmp %>/<%= grunt.task.current.args[0] %>'],
        srv: ['<%= paths.srv %>/<%= grunt.task.current.args[0] || "**" %>']
      },
    copy: {
        js: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/scripts',
                    src: '**/*.js',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/scripts'
                  }
              ]
          },
        js_libs: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/js_libs',
                    src: '**/*.js',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/scripts/libs'
                  }
              ]
          },
        css: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/styles',
                    src: '**/*.css',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/styles'
                  }
              ]
          },
        css_libs: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/css_libs',
                    src: '**/*.css',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/styles/libs'
                  }
              ]
          },
        images: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/images'
                  }
              ]
          },
        svg: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/svg',
                    src: '**/*.svg',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/svg'
                  }
              ]
          },
        html: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/',
                    src: '*.html',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/'
                  }
              ]
          },
        templates: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/templates',
                    src: '*.html',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/templates'
                  }
              ]
          },
        partials: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/partials',
                    src: '*.html',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/partials'
                  }
              ]
          },
        misc: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>',
                    src: [
                        '**/**',
                        '!scripts/**/*.js',
                        '!libs/**/*.js',
                        '!styles/**/*.css',
                        '!images/**/*.{png,jpg,jpeg}',
                        '!svg/**/*.svg',
                        '!**/*.html'
                      ],
                    dest: '<%= paths[grunt.task.current.args[1]] %>'
                  }
              ]
          },
      },

    // Javascript
    jshint: {
        src: '<%= paths.working %>/scripts/*.js',
        options: {
            jshintrc: '.jshintrc',
            reporter: require('reporter-plus/jshint')
          }
      },
    jscs: {
        src: '<%= paths.working %>/scripts/*.js',
        options: {
            config: ".jscsrc",
            // reporter: require('jscs-stylish').path
            reporter: require('reporter-plus/jscs').path
          }
      },
    uglify: {
        js: {
            options: {
                sourceMap: true
              },
            files: [
                {
                    src: '<%= paths[grunt.task.current.args[0]] %>/scripts/**/*.js',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/scripts/<%= default_filename %>.min.js'
                  }
              ]
          },
        libs: {
            options: {
                sourceMap: true
              },
            files: [
                {
                    src: '<%= paths[grunt.task.current.args[0]] %>/libs_js/**/*.js',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/scripts/libs.min.js'
                  }
              ]
          }
      },

    // CSS
    stylus: {
        all: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths.working %>/styles',
                    src: '*.styl',
                    dest: '<%= paths.temp %>/styles',
                    ext: '.css'
                  }
              ]
          }
      },
    autoprefixer: {
        options: {
            browsers: ['last 2 versions']
          },
        all: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths.temp %>/styles',
                    src: '*.css',
                    dest: '<%= paths.temp %>/styles'
                  }
              ]
          }
      },
    cssmin: {
        prod: {
            options: {
                sourceMap: true
              },
            files: [
                {
                    src: '<%= paths.temp %>/styles/*.css',
                    dest: '<%= paths.temp %>/min_styles/<%= default_filename %>.min.css'
                  }
              ]
          }
      },

    // Bower libs
    importbower: {
        all: {
            options: {
                cwd: '<%= paths[grunt.task.current.args[1]] %>',
                js_dest: '<%= paths[grunt.task.current.args[1]] %>/js_libs',
                css_dest: '<%= paths[grunt.task.current.args[1]] %>/css_libs'
              },
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>',
                    src: '*.html',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/html'
                  }
              ]
          }
      },

    // Images / SVG
    imagemin: {
        prod: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths[grunt.task.current.args[0]] %>/images',
                    src: '**/*.{gif,png,jpg,jpeg}',
                    dest: '<%= paths[grunt.task.current.args[1]] %>/images'
                  }
              ]
          }
      },

    svgstore: {
        options: {
            prefix : 'icon-',
            svg: {
                style: 'display:none;',
                xmlns: 'http://www.w3.org/2000/svg'
              }
          },
        all: {
            files: {
                '<%= paths.temp %>/svg/icons.svg': ['<%= paths.working %>/svg/*.svg']
              }
          }
      },

    // HTML
    processhtml: {
        options: {
            commentMarker: 'process',
            includeBase: '<%= paths.temp %>',
            strip: true
          },
        dev: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths.working %>/partials',
                    src: '*.html',
                    dest: '<%= paths.temp %>/partials'
                  },
                {
                    expand: true,
                    cwd: '<%= paths.working %>',
                    src: '*.html',
                    dest: '<%= paths.temp %>/html'
                  },
                {
                    expand: true,
                    cwd: '<%= paths.working %>/templates',
                    src: '*.html',
                    dest: '<%= paths.temp %>/templates'
                  }
              ]
          },
        prod: {
            files: [
                {
                    expand: true,
                    cwd: '<%= paths.working %>/partials',
                    src: '*.html',
                    dest: '<%= paths.temp %>/partials'
                  },
                {
                    expand: true,
                    cwd: '<%= paths.working %>',
                    src: '*.html',
                    dest: '<%= paths.temp %>/html'
                  },
                {
                    expand: true,
                    cwd: '<%= paths.working %>/templates',
                    src: '*.html',
                    dest: '<%= paths.temp %>/templates'
                  }
              ]
          }
      },

    // Copy to final directories
    // copy: {
    //     to_dev: {
    //         files: [
    //             { // HTML
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/html',
    //                 src: '*.html',
    //                 dest: '<%= paths.dev %>'
    //               },
    //             { // Templates
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/templates',
    //                 src: '*.html',
    //                 dest: '<%= paths.dev %>/templates'
    //               },
    //             { // Javascript
    //                 expand: true,
    //                 cwd: '<%= paths.working %>/scripts',
    //                 src: '*.js',
    //                 dest: '<%= paths.dev %>/scripts'
    //               },
    //             { // Libs
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/libs',
    //                 src: '*.js',
    //                 dest: '<%= paths.dev %>/scripts/libs'
    //               },
    //             { // CSS
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/styles',
    //                 src: '*.css',
    //                 dest: '<%= paths.dev %>/styles'
    //               },
    //             { // SVG
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/svg',
    //                 src: '*.svg',
    //                 dest: '<%= paths.dev %>/svg'
    //               },
    //             { // Misc
    //                 expand: true,
    //                 cwd: '<%= paths.working %>',
    //                 src: [
    //                     '*.{ico,txt}',
    //                     '.htaccess',
    //                     'images/**',
    //                     'fonts/**'
    //                   ],
    //                 dest: '<%= paths.dev %>'
    //               }
    //           ]
    //       },
    //     to_prod: {
    //         files: [
    //             { // HTML
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/html',
    //                 src: '*.html',
    //                 dest: '<%= paths.prod %>'
    //               },
    //             { // Templates
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/templates',
    //                 src: '*.html',
    //                 dest: '<%= paths.prod %>/templates'
    //               },
    //             { // Javascript
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/min_scripts',
    //                 src: ['*.min.js', '*.map'],
    //                 dest: '<%= paths.prod %>/scripts'
    //               },
    //             { // CSS
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/min_styles',
    //                 src: ['*.min.css', '*.map'],
    //                 dest: '<%= paths.prod %>/styles'
    //               },
    //             { // Images
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/images',
    //                 src: '**/*.{png,jpg,jpeg}',
    //                 dest: '<%= paths.prod %>/images'
    //               },
    //             { // SVG
    //                 expand: true,
    //                 cwd: '<%= paths.temp %>/svg',
    //                 src: '*.svg',
    //                 dest: '<%= paths.dev %>/svg'
    //               },
    //             { // Misc
    //                 expand: true,
    //                 cwd: '<%= paths.working %>',
    //                 src: [
    //                     '*.{ico,txt}',
    //                     '.htaccess',
    //                     'fonts/**'
    //                   ],
    //                 dest: '<%= paths.prod %>'
    //               }
    //           ]
    //       },
    //   },

    // Server and loading tasks
    express: {
        dev: {
            options: {
                port: 9010,
                hostname: '0.0.0.0',
                bases: ['_dev']
              }
          },
        prod: {
            options: {
                port: 9011,
                hostname: '0.0.0.0',
                bases: ['_prod']
              }
          }
      },
    load: {
        dev: [
            {
                reload_pattern: 'https?:\/\/<%= express.dev.options.hostname %>:<%= express.dev.options.port %>',
                new_url: 'http://<%= express.dev.options.hostname %>:<%= express.dev.options.port %>'
              },
          ],
        prod: [
            {
                reload_pattern: 'https?:\/\/<%= express.prod.options.hostname %>:<%= express.prod.options.port %>',
                new_url: 'http://<%= express.prod.options.hostname %>:<%= express.prod.options.port %>'
              }
          ]
      },
    watch: {
        dev: {
            files: [
                '<%= paths.working %>/**/*',
                'bower.json'
              ],
            tasks: [
                'build:dev',
                'load:dev'
              ]
          },
        prod: {
            files: [
                '<%= paths.working %>/**/*',
                'bower.json'
              ],
            tasks: [
                'build:prod',
                'load:prod'
              ]
          }
      }
  });

  /* --- Build tasks for specific filetypes ---
   * The procedure, generally, should be:
   * - Copy relevant files from working to tmp
   * - Perform all operations on files in tmp, overwriting files as necessary
   * - When all operations have finished, copy final files to srv
   */

  grunt.registerTask('build:js', function() {
    if (target === 'prod') {
      grunt.task.run([
        'jshint',
        'jscs',
        'clean:tmp:js',
        'uglify:js:working:tmp',
        // TODO: filenames
        'clean:srv:js',
        'copy:js:tmp:srv'
      ]);

    } else {
      grunt.task.run([
        'jshint',
        'jscs',
        'clean:srv:js',
        'copy:js:working:srv'
      ]);
    }
  });


  grunt.registerTask('build:libs', function() {
    if (target === 'prod') {
      grunt.task.run([
        'clean:tmp:js_libs',
        'clean:tmp:css_libs',
        'uglify:js:tmp:srv',
        'clean:srv:js_libs',
        'copy:js:working:srv'
      ]);

    } else {
      grunt.task.run([
        'clean:tmp:js_libs',
        'clean:tmp:css_libs',
        'copy:js:working:srv'
      ]);
    }
  });

  grunt.registerTask('build:images', function() {
    if (target === 'prod') {
      grunt.task.run([
        'clean:tmp:images',
        'copy:images:working:tmp',
        'imagemin:tmp:tmp',
        'clean:srv:images',
        'copy:images:tmp:srv'
      ]);
    } else {
      grunt.task.run([
        // No need to clean tmp, if we're not even gonna use it
        'clean:srv:images',
        'copy:images:working:srv'
      ]);
    }
  });

  // Default task.
  grunt.registerTask('default', ['build:dev']);

  grunt.registerTask('build:dev', [
    // Start fresh
    'clean:temp',

    // Process Javascript
    'jshint',
    'bower',

    // Process CSS
    'stylus',
    'autoprefixer',

    // Process images and SVG
    'svgstore',

    // HTML
    'processhtml:dev',

    // Finish
    'clean:dev',
    'copy:to_dev'
  ]);
  grunt.registerTask('build:prod', [
    // Start fresh
    'clean:temp',

    // Process Javascript
    'jshint',
    'bower',
    'uglify',

    // Process CSS
    'stylus',
    'autoprefixer',
    'cssmin',

    // Process images and SVG
    'imagemin',
    'svgstore',

    // Process HTML
    'processhtml:prod',

    // Finish
    'clean:prod',
    'copy:to_prod'
  ]);

  grunt.registerTask('serve:dev', [
    'build:dev',
    'express:dev',
    'load:dev',
    'watch:dev'
  ]);
  grunt.registerTask('serve:prod', [
    'build:prod',
    'express:prod',
    'load:prod',
    'watch:prod'
  ]);
  grunt.registerTask('serve', ['serve:dev']);

  grunt.registerTask('notify', 'Send an OSX notification to the user', function(title, message) {
    // var exec = require('child_process').execSync;

    message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    // exec('osascript -e \'display notification "' + message + '" with title "' + grunt.config('name') + '"\'');

    var notifier = require('node-notifier');

    notifier.notify({
      'title': grunt.config('name') + (title ? (' - ' + title) : ''),
      'message': message,
      'sound': 'Basso',
      'icon': '/Users/jayeb/Pictures/Desktops/transitions.jpg'
    });
  });

  grunt.registerTask('hint', function() {
    var done = this.async();

    console.log('hey');

    grunt.task.run('jshint');

    done();
  });

  grunt.registerMultiTask('importbower', function() {
    var wiredep = require('wiredep'),
        path = require('path'),
        options,
        deps = wiredep(),
        jsMap = {},
        cssMap = {},
        jsFiles,
        cssFiles;


    // Set default options
    options = this.options({
      path_cwd: null, // When generating relative paths from the src file to the libs, use this cwd
      css_dest: 'bower_imports/css',
      css_marker: '<!-- importbower:css -->',
      css_tag: '<link rel="stylesheet" href="%s" />',
      js_dest: 'bower_imports/js',
      js_marker: '<!-- importbower:js -->',
      js_tag: '<script type="text/javascript" src="%s"></script>'
    });

    _.each(deps.packages, function(package, name) {
      _.each(package.main, function(file) {
        if (/\.js$/.test(file)) {
          jsMap[file] = name;
        } else if (/\.css$/.test(file)) {
          cssMap[file] = name;
        }
      });
    });

    jsFiles = _.map(deps.js, function(file) {
      var name = jsMap[file];
      return {
        src: file,
        dest: path.normalize(options.js_dest + '/' + name + '.js')
      };
    });

    cssFiles = _.map(deps.css, function(file) {
      var name = cssMap[file];
      return {
        src: file,
        dest: path.normalize(options.css_dest + '/' + name + '.css')
      };
    });

    grunt.config.merge({
      copy: {
          '.importbower' : {
              files: jsFiles.concat(cssFiles)
            }
        }
    })

    grunt.task.run('copy:.importbower');

    _.each(this.files, function(file) {
      grunt.file.copy(file.src, file.dest, {
        process: function(contents) {
            var fileDir = options.cwd || path.dirname(file.dest);

            scriptBlock = _.map(jsFiles, function(libFile) {
              var relPath = path.relative(fileDir, libFile.dest);
              return options.js_tag.replace('%s', relPath);
            }).join('\n    ');

            styleBlock = _.map(cssFiles, function(libFile) {
              var relPath = path.relative(fileDir, libFile.dest);
              return options.css_tag.replace('%s', relPath);
            }).join('\n    ');

            contents = contents.replace(options.js_marker, scriptBlock);
            contents = contents.replace(options.css_marker, styleBlock);

            grunt.log.writeln('Imported ' + jsFiles.length + ' JS packages and ' + cssFiles.length + ' CSS packages into '+ file.dest);

            return contents;
          }
      });
    });
  });

  grunt.registerMultiTask('load', 'Load or reload relevant Chrome tabs', function() {
    var exec = require('child_process').execSync,
        tabList = exec('chrome-cli list links', {encoding: 'utf8'}).split("\n"),
        tabRegex = /\[(\d+):(\d+)\]\s/;

    this.data.forEach(function(tabData) {
      var urlRegex = new RegExp(tabData.reload_pattern),
          matchingTabs = tabList.filter(urlRegex.test.bind(urlRegex));

      if (matchingTabs.length) {
        matchingTabs.forEach(function(tabInfo) {
          // [0] is full match, [1] is window id, [2] is tab id
          exec('chrome-cli reload -t ' + tabRegex.exec(tabInfo)[2]);
        });
        grunt.log.writeln('Reloaded ' + matchingTabs.length + ' tab' + (matchingTabs.length > 1 ? 's' : '') + ' matching '+ urlRegex.toString());
      } else {
        exec('chrome-cli open ' + tabData.new_url);
        grunt.log.writeln('Opening fresh tab at ' + tabData.new_url);
      }
    });
  });

};
