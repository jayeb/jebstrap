var path = require('path'),
    _ = require('lodash');

module.exports = function(task, args) {
  var name = 'jebweb-project',
      appBase = '.',
      baseServerPort = 9010,
      banner = '/* ' + name + ' - Built: ' + Date.now() + ' */\n',
      allEnvs = ['dev', 'test', 'prod'],
      env, // Used to store global env, once it's decided
      isProd,
      appSrcBase,
      appTestBase,
      appDestBase;

  if (/^test/.test(task)) {
    env = 'test';
  } else if (process.env.NODE_ENV && _.includes(allEnvs, process.env.NODE_ENV)) {
    env = process.env.NODE_ENV;
  } else if (args.env && _.includes(allEnvs, args.env)) {
    env = args.env;
  } else {
    env = 'dev';
  }

  isProd = (env === 'prod');
  appSrcBase = path.join(appBase, 'app');
  appDestBase = path.join(appBase, '.' + env + '_srv');
  appTestBase = path.join(appBase, 'test');

  return {
    name: name,
    ngName: ngName,
    destPath: appDestBase,

    appAssets: {
        js: {
            src: [
                path.join(appSrcBase, 'base', 'scripts', 'app.js'),
                path.join(appSrcBase, 'base', 'scripts', '*.js'),
                path.join(appSrcBase, '**', '*.js'),
                '!' + path.join('**', '*.test.js')
              ],
            dest: path.join(appDestBase, 'scripts'),
            build: true,
            buildOptions: {
                doCheck: true,
                doMinify: isProd,
                doConcat: isProd,
                doBanner: isProd,
                doVersioning: isProd,
                doSourceMaps: isProd,
                concatName: name + '.js',
                banner: banner
              }
          },
        css: {
            src: [
                path.join(appSrcBase, 'base', 'styles', '*.css'),
                path.join(appSrcBase, '**', '*.css')
              ],
            dest: path.join(appDestBase, 'styles'),
            build: true,
            buildOptions: {
                doMinify: isProd,
                doConcat: isProd,
                doBanner: isProd,
                doVersioning: isProd,
                doSourceMaps: isProd,
                concatName: name + '.css',
                banner: banner,
                pluginOptions: {
                    'postcss-import': {
                        root: appBase,
                        path: appSrcBase
                      }
                  }
              }
          },
        svg: {
            src: [
                path.join(appSrcBase, 'static', 'svg', '**', '*.svg')
              ],
            dest: path.join(appDestBase, 'svg'),
            build: true,
            buildOptions: {
                doMinify: isProd,
                concatName: name + '.svg'
              }
          },
        headerPartials: {
            src: [
                path.join(appSrcBase, 'static', 'partials', 'header.*.html')
              ],
            dest: path.join(appBase, '.tmp'),
            build: true,
            builder: 'html',
            buildOptions: {
                doCheck: false, // Turn off checking because we don't have control over some of these snippets
                doMinify: false, // No need to ever minify here, since minifying the whole page will take care of it
                processOptions: {
                    environment: env,
                  }
              }
          },
        footerPartials: {
            src: [
                path.join(appSrcBase, 'static', 'partials', 'footer.*.html')
              ],
            dest: path.join(appBase, '.tmp'),
            build: true,
            builder: 'html',
            buildOptions: {
                doCheck: false, // Turn off checking because we don't have control over some of these snippets
                doMinify: false, // No need to ever minify here, since minifying the whole page will take care of it
                processOptions: {
                    environment: env,
                  }
              }
          },
        html: {
            src: [
                path.join(appSrcBase, '*.html')
              ],
            dest: appDestBase,
            build: true,
            buildOptions: {
                doCheck: true,
                doMinify: isProd,
                doInject: true,
                injectOptions: {
                    ignorePath: appDestBase
                  },
                processOptions: {
                    environment: env,
                  }
              },
            appAssetDependencies: [
                'js',
                'templates',
                'css',
                'svg',
                'headerPartials',
                'footerPartials'
              ],
            extAssetDependencies: [
                'js',
                'css',
                'svg',
                'partials'
              ]
          },
        misc: {
            src: [
                path.join(appSrcBase, 'static', 'misc', '**', '*.*')
              ],
            dest: appDestBase
          }
      },

    extAssets: {
        js: {
            build: true,
            buildOptions: {
                doCheck: false,
                doMinify: isProd,
                doConcat: isProd,
                doBanner: false,
                doVersioning: isProd,
                doSourceMaps: isProd,
                uglifyOptions: {
                    mangle: false
                  },
                concatName: 'libs.js'
              },
            dest: path.join(appDestBase, 'scripts', 'libs')
          },
        css: {
            build: true,
            buildOptions: {
                doCheck: false,
                doMinify: isProd,
                doConcat: isProd,
                doBanner: false,
                doVersioning: isProd,
                doSourceMaps: isProd,
                concatName: 'libs.css'
              },
            dest: path.join(appDestBase, 'styles', 'libs')
          },
        svg: {},
        partials: {
            filter: path.join('**', '*.html')
          }
      },

    bower: {
        json: path.join(appBase, 'bower.json'),
        components: path.join(appBase, 'bower_components')
      },

    server: {
        port: baseServerPort + allEnvs.indexOf(env),
        hostname: 'localhost',
        root: appDestBase
      },

    unitTests: {
        src: [
            path.join(appSrcBase, '**', '*.test.js')
          ],
        karmaOptions: {
            browsers: ['PhantomJS'],
            ngHtml2JsPreprocessor: {
                moduleName: ngName
              }
          }
      },

    integrationTests: {
        src: [
            path.join(appTestBase, '**', 'spec.*.js')
          ],
        browser: 'Firefox',
        eyeballOptions: {
            screenshotRoot: appTestBase,
            widths: [320, 480, 640, 768, 1024]
          }
      }
  };
}
