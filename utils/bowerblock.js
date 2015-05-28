'use strict';

module.exports = function (processor) {
  // This will allow to use this <!-- build:customBlock[:target] <value> --> syntax
  processor.registerBlockType('importbower', function (content, block, blockLine, blockContent) {
    console.log(block, blockLine, blockContent);
  });
};
