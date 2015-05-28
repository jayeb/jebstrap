var _ = require('lodash'),
    path = require('path'),
    wiredep = require('wiredep')

module.exports = (function bowerDeps() {
  var storedLibs;

  return function findInBowerImports(options) {
    var output = {};

    options = _.defaults({}, options, {
      types: ['js', 'css'],
      excludePackages: [],
      wiredepOptions: {},
      force: false
    });

    if (!storedLibs || options.force) {
      storedLibs = {};
      dependencyData = wiredep(options.wiredepOptions);

      _.each(dependencyData.packages, function packageLoop(package, name) {
        var packageBundles = {};

        _.each(package.main, function mainfileLoop(src) {
          type = path.extname(src).substr(1);

          if (!packageBundles[type]) {
            packageBundles[type] = {
              type: type,
              name: name,
              files: []
            };
          }

          packageBundles[type].files.push(src);
        });

        _.each(packageBundles, function(packageBundle, type) {
          if (!storedLibs[type]) {
            storedLibs[type] = [];
          }

          storedLibs[type].push(packageBundle);
        });
      });
    }

    _.each(storedLibs, function(libs, type) {
      if (_.contains(options.types, type)) {
        output[type] = _.reject(libs, function(lib) {
          return _.contains(options.excludePackages, lib.name);
        });
      }
    });

    return output;
  };
})();
