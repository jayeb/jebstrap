var _ = require('lodash');

module.exports = function(grunt) {
  var env = (grunt.option('env') === 'prod' ? 'prod' : 'dev'),
      pipe = require('./utils/pipe-grunt')(grunt);

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    name: '<%= pkg.name %>',
    default_filename: '<%= pkg.name.toLowerCase().replace(/[^A-Za-z0-9]/g, "_") %>',
    paths: {
        tmp: '.tmp',
        srv: '.' + env + '_srv',
        working: 'app'
      },


    // File and directory manipulation
    // copy: {
    //     html: {
    //         files: [
    //             {
    //                 expand: true,
    //                 cwd: '<%= paths[grunt.task.current.args[0]] %>/',
    //                 src: '*.html',
    //                 dest: '<%= paths[grunt.task.current.args[1]] %>/'
    //               }
    //           ]
    //       },
    //     templates: {
    //         files: [
    //             {
    //                 expand: true,
    //                 cwd: '<%= paths[grunt.task.current.args[0]] %>/templates',
    //                 src: '*.html',
    //                 dest: '<%= paths[grunt.task.current.args[1]] %>/templates'
    //               }
    //           ]
    //       },
    //     partials: {
    //         files: [
    //             {
    //                 expand: true,
    //                 cwd: '<%= paths[grunt.task.current.args[0]] %>/partials',
    //                 src: '*.html',
    //                 dest: '<%= paths[grunt.task.current.args[1]] %>/partials'
    //               }
    //           ]
    //       },
    //     misc: {
    //         files: [
    //             {
    //                 expand: true,
    //                 cwd: '<%= paths[grunt.task.current.args[0]] %>',
    //                 src: [
    //                     '**/**',
    //                     '!scripts/**/*.js',
    //                     '!libs/**/*.js',
    //                     '!styles/**/*.css',
    //                     '!images/**/*.{png,jpg,jpeg}',
    //                     '!svg/**/*.svg',
    //                     '!**/*.html'
    //                   ],
    //                 dest: '<%= paths[grunt.task.current.args[1]] %>'
    //               }
    //           ]
    //       },
    //   },

    // Javascript
    jshint: {
        src: '<%= paths.working %>/scripts/**/*.js',
        options: {
            jshintrc: '.jshintrc',
            reporter: require('reporter-plus/jshint')
          }
      },
    jscs: {
        src: '<%= paths.working %>/scripts/**/*.js',
        options: {
            config: ".jscsrc",
            reporter: require('reporter-plus/jscs').path
          }
      },
    uglify: {
        options: {
            sourceMap: true
          }
      },

    // CSS
    autoprefixer: {
        options: {
            browsers: ['last 2 versions']
          }
      },
    cssmin: {
        options: {
            sourceMap: true
          }
      },

    // SVG
    svgstore: {
        options: {
            prefix : 'icon-',
            svg: {
                style: 'position:absolute; width:0; height:0; visibility:hidden;',
                xmlns: 'http://www.w3.org/2000/svg'
              }
          }
      },

    // Bower libs
    importbower: {
        all: {
            options: {
                cwd: '<%= paths[grunt.task.current.args[1]] %>',
                import_types: {
                    js: {
                        dest: '<%= paths[grunt.task.current.args[1]] %>/js_libs'
                      },
                    css: {
                        dest: '<%= paths[grunt.task.current.args[1]] %>/css_libs'
                      }
                  }
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

    // Server and loading tasks
    express: {
        options: {
            port: env === 'dev' ? 9010 : 9011,
            hostname: '0.0.0.0',
            bases: env === 'dev' ? ['_dev'] : ['_prod']
          }
      },
    chromeload: {
        server: {
            reload_pattern: 'https?:\/\/<%= express.options.hostname %>:<%= express.options.port %>',
            new_url: 'http://<%= express.options.hostname %>:<%= express.options.port %>'
          }
      },
    watch: {
        js: {
            files: [
                '<%= paths.working %>/scripts/**/*.js',
              ],
            tasks: [
                'build:js',
                'chromeload:server'
              ]
          },
        css: {
            files: [
                '<%= paths.working %>/styles/**/*.css',
              ],
            tasks: [
                'build:css',
                'chromeload:server'
              ]
          },
        images: {
            files: [
                '<%= paths.working %>/images/**/*.{jpg,jpeg,gif,png}',
              ],
            tasks: [
                'build:images',
                'chromeload:server'
              ]
          },
        svg: {
            files: [
                '<%= paths.working %>/svg/**/*.svg',
              ],
            tasks: [
                'build:svg',
                'chromeload:server'
              ]
          },
        html: {
            files: [
                '<%= paths.working %>/**/*.html',
              ],
            tasks: [
                'build:html',
                'chromeload:server'
              ]
          },
        libs: {
            files: [
                'bower.json',
              ],
            tasks: [
                'build:libs',
                'build:html',
                'chromeload:server'
              ]
          }
      }
  });

  /* --- Build tasks for specific filetypes ---*/

  grunt.registerTask('build:js', function() {
    var tasks = [],
        files;

    tasks = [
      {
          task: 'jshint',
          fileDefaults: false
        },
      {
          task: 'jscs',
          fileDefaults: false
        }
    ];

    if (env === 'prod') {
      tasks.push(
        {
            task: 'uglify',
            fileDefaults: {
                dest: grunt.config('default_filename') + '.min.js'
              }
          }
      );
    }

    files = {
      expand: true,
      cwd: grunt.config('paths.working') + '/scripts',
      src: '**/*.js',
      dest: grunt.config('paths.srv') + '/scripts'
    };

    pipe.run(tasks, files);
  });

  grunt.registerTask('build:css', function() {
    var tasks,
        files;

    tasks = [
      {
          task: 'stylus',
          fileDefaults: {
              ext: '.css'
            }
        },
      'autoprefixer'
    ];

    if (env === 'prod') {
      tasks.push(
        {
            task: 'cssmin',
            fileDefaults: {
                dest: grunt.config('default_filename') + '.min.css'
              }
          }
      );
    }

    files = {
      expand: true,
      cwd: grunt.config('paths.working') + '/styles',
      src: '**/*.styl',
      dest: grunt.config('paths.srv') + '/styles'
    };

    pipe.run(tasks, files);
  });

  grunt.registerTask('build:images', function() {
    var tasks = [],
        files;

    if (env === 'prod') {
      tasks.push('imagemin');
    }

    files = {
      expand: true,
      cwd: grunt.config('paths.working') + '/images',
      src: '**/*.{jpg,jpeg,gif,png}',
      dest: grunt.config('paths.srv') + '/images'
    };

    pipe.run(tasks, files);
  });

  grunt.registerTask('build:svg', function() {
    var tasks = [],
        files;

    tasks.push(
      {
          task: 'svgstore',
          fileDefaults: {
              dest: 'icons.svg'
            }
        }
    );

    files = {
      expand: true,
      cwd: grunt.config('paths.working') + '/svg',
      src: '**/*.svg',
      dest: grunt.config('paths.srv') + '/svg'
    };

    pipe.run(tasks, files);
  });




  grunt.registerTask('build:libs', function() {
    if (target === 'prod') {
      grunt.task.run([
        'clean:tmp:js_libs',
        'importbower:tmp:js_libs',
        'clean:tmp:css_libs',
        'uglify:js:tmp:srv',
        'clean:srv:js_libs',
        'copy:js:working:srv'
      ]);

    } else {
      grunt.task.run([
        'clean:tmp:js_libs',
        'clean:tmp:css_libs',
        'importbower:tmp',
        'copy:js_libs:working:srv',
      ]);
    }
  });


  // Default task.
  grunt.registerTask('default', ['build:all']);

  grunt.registerTask('serve', [
    'build:all',
    'express',
    'load',
    'watch'
  ]);

};
