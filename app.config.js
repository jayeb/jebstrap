var path = require('path'),
    _ = require('lodash'),
    pkg = require('./package.json'),
    dirs = {
        src: 'app',
        js: 'scripts'
        css: 'styles',
        images: 'images',
        svg: 'svg',
        fonts: 'fonts',
        templates: 'templates',
        partials: 'partials'
      },
    bundles: require(path.join(dirs.src, '/bundles.json'));

module.exports = function(env) {
  function getAllBundleFilesOfType(bundleType) {
    return _.chain(bundles[bundleType], function(bundleFiles, bundleName) {
      return _.map(bundleFiles, function(bundleFile) {
        return path.join(dir.src, dirs[bundleType], bundleFile);
      });
    }).flatten().value();
  }

  function getMinimatchObjectFromBundle(bundleType) {
    var minimatchObj = {};

    _.each(bundles[bundleType], function(bundleFiles, bundleName) {
      minimatchObj[bundleName] = .map(bundleFiles, function(bundleFile) {
        return path.join(dir.src, dirs[bundleType], bundleFile);
      });
    });

    return minimatchObj;
  }

  return {
    paths: {
        src: dirs.src,
        dest: '.' + env + '_srv'
      },
    dirs: dirs,

    srcFiles: {
        js: getAllBundleFilesOfType('js'),
        css: getAllBundleFilesOfType('css'),
        svg: getAllBundleFilesOfType('svg'),
        images: path.join(dirs.src, dirs.images, '**/*.{jpg,jpeg,png,gif,webp}'),
        html: path.join(dirs.src, '*.html')
        partials: path.join(dirs.src, dirs.partials, '*.html')
      },

    pkg: pkg,
    safeName: pkg.name.toLowerCase().replace(/\s/, '_').replace(/\W/, ''),

    banner: '/* ' + // Template for banner that goes atop all compiled assets.
      ([pkg.name, 'License: ' + pkg.license, 'Built: ' + Date.now()]).join(' - ') +
      ' */\n',

    server: {},

    taskOptions: {
        svgstore: {
            svg: {
                style: 'position:absolute;width:0;height:0;visibility:hidden;',
                xmlns: 'http://www.w3.org/2000/svg'
              }
          },
        processhtml: {
            commentMarker: 'process',
            environment: env,
            strip: true
          }
      }
  };
}
