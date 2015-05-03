module.exports = function(grunt) {
  // Show elapsed time at the end
  require('time-grunt')(grunt);

  require('jit-grunt')(grunt, {
    bower: 'main-bower-files'
  });

  grunt.initConfig({
    name: 'scoreboard',
    paths: {
        temp: '_temp',
        dev: '_dev',
        prod: '_prod',
        working: 'app'
      },

    // Cleaning directories
    clean: {
        dev: ['<%= paths.dev %>'],
        prod: ['<%= paths.prod %>'],
        temp: ['<%= paths.temp %>']
      },

    // Javascript
    jshint: {
        options: {
            jshintrc: '.jshintrc',
            reporter: require('jshint-stylish')
          },
        all: [
            '<%= paths.working %>/scripts/*.js'
          ]
      },
    bower: {
        all: {
            dest: '<%= paths.temp %>/libs'
          }
      },
    uglify: {
        prod: {
            options: {
                sourceMap: true
              },
            files: [
                {
                    src: '<%= paths.temp %>/libs/*.js',
                    dest: '<%= paths.temp %>/min_scripts/libs.min.js'
                  },
                {
                    src: '<%= paths.working %>/scripts/*.js',
                    dest: '<%= paths.temp %>/min_scripts/<%= name %>.min.js'
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
                    dest: '<%= paths.temp %>/min_styles/<%= name %>.min.css'
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
                    cwd: '<%= paths.working %>/images',
                    src: '**/*.{gif,png,jpg,jpeg}',
                    dest: '<%= paths.temp %>/images'
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
    copy: {
        to_dev: {
            files: [
                { // HTML
                    expand: true,
                    cwd: '<%= paths.temp %>/html',
                    src: '*.html',
                    dest: '<%= paths.dev %>'
                  },
                { // Templates
                    expand: true,
                    cwd: '<%= paths.temp %>/templates',
                    src: '*.html',
                    dest: '<%= paths.dev %>/templates'
                  },
                { // Javascript
                    expand: true,
                    cwd: '<%= paths.working %>/scripts',
                    src: '*.js',
                    dest: '<%= paths.dev %>/scripts'
                  },
                { // Libs
                    expand: true,
                    cwd: '<%= paths.temp %>/libs',
                    src: '*.js',
                    dest: '<%= paths.dev %>/scripts/libs'
                  },
                { // CSS
                    expand: true,
                    cwd: '<%= paths.temp %>/styles',
                    src: '*.css',
                    dest: '<%= paths.dev %>/styles'
                  },
                { // SVG
                    expand: true,
                    cwd: '<%= paths.temp %>/svg',
                    src: '*.svg',
                    dest: '<%= paths.dev %>/svg'
                  },
                { // Misc
                    expand: true,
                    cwd: '<%= paths.working %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'images/**',
                        'fonts/**'
                      ],
                    dest: '<%= paths.dev %>'
                  }
              ]
          },
        to_prod: {
            files: [
                { // HTML
                    expand: true,
                    cwd: '<%= paths.temp %>/html',
                    src: '*.html',
                    dest: '<%= paths.prod %>'
                  },
                { // Templates
                    expand: true,
                    cwd: '<%= paths.temp %>/templates',
                    src: '*.html',
                    dest: '<%= paths.prod %>/templates'
                  },
                { // Javascript
                    expand: true,
                    cwd: '<%= paths.temp %>/min_scripts',
                    src: ['*.min.js', '*.map'],
                    dest: '<%= paths.prod %>/scripts'
                  },
                { // CSS
                    expand: true,
                    cwd: '<%= paths.temp %>/min_styles',
                    src: ['*.min.css', '*.map'],
                    dest: '<%= paths.prod %>/styles'
                  },
                { // Images
                    expand: true,
                    cwd: '<%= paths.temp %>/images',
                    src: '**/*.{png,jpg,jpeg}',
                    dest: '<%= paths.prod %>/images'
                  },
                { // SVG
                    expand: true,
                    cwd: '<%= paths.temp %>/svg',
                    src: '*.svg',
                    dest: '<%= paths.dev %>/svg'
                  },
                { // Misc
                    expand: true,
                    cwd: '<%= paths.working %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'fonts/**'
                      ],
                    dest: '<%= paths.prod %>'
                  }
              ]
          },
      },

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
