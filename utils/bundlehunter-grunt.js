var _ = require('lodash'),
    chalk = require('chalk'),
    path = require('path'),
    wiredep = require('wiredep');

module.exports = function bundleHunter(grunt) {
  var bundleRegex = /<!-- bundle:([a-z]+)\s(\w+) -->((?:.|\n)+?)<!-- \/bundle -->/gim,
      tagRegex = /<.*?(?:(?:src)|(?:href))="(.+?)".*?>/gi;

  function findIn(sourceFiles, options) {
    var inputFiles,
        bundles = {},
        parseBundle;

    options = _.defaults(options, {
      types: ['js', 'css'],
      allowBundles: [],
      disallowBundles: []
    });

    inputFiles = _.chain(grunt.task.normalizeMultiTaskFiles(sourceFiles))
      .pluck('src')
      .flatten()
      .value();

    _.each(options.types, function(type) {
      bundles[type] = [];
      bundlesDict[type] = {};
    });

    parseBundle = _.spread(function(match, type, name, contents) {
      var tag,
          files = [];

      if (
        !!bundles[type] &&
        !bundlesDict[type][name] &&
        !_.contains(options.disallowBundles, name) &&
        (!options.allowBundles.length || _.contains(options.allowBundles, name))
      ) {

        while (tag = tagRegex.exec(contents)) {
          files.push(tag[1]);
        }

        // Reset index so the next bundle can re-use this regex
        tagRegex.lastIndex = 0;

        bundles[type].push({
          name: name,
          files: files
        });
        bundlesDict[type][name] = true;
      }
    });

    _.each(inputFiles, function huntInFile(file) {
      var html = grunt.file.read(file),
          bundle;

      while (bundle = bundleRegex.exec(html)) {
        parseBundle(bundle);
      }

      // Reset index so the next bundle can re-use this regex
      bundleRegex.lastIndex = 0;
    });

    return bundles;
  };

  function findInBower(options) {
    options = _.defaults(options, {
      types: ['js', 'css'],
      allowBundles: [],
      disallowBundles: []
    });
  };

  return {
    findIn: findIn,
    findInBower: findInBower
  }
};
