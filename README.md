# JebWeb

JebWeb is my bootstrap repo for personal projects. It's also where I can experiment with best practices involving various development tools and techniques.

This README is intended as a boilerplate as well. If it seems overly verbose to you, zip it. This README is used when I collaborate on projects with others, who may or may not be familiar with all of these tools. I'd rather over-explain and annoy a dork than under-explain and make someone feel bad for needing to ask.

## Building

This project uses:

* **NPM** to install and handle packages needed for development tasks, such as Grunt, Express, and JSHint.
* **Bower** to install and handle packages needed for the client side of the project, such as jQuery and Lodash.
* **Grunt** to run development tasks, such as linting files to check for mistakes, serving a local version of the site for testing, and packaging the project up for production.

### After you clone this repo:

1. **Run `sudo npm install -g grunt-cli`**, to ensure you have grunt-cli install globally.
* **Run `npm install`**. This will read the `package.json` file included in the root folder, then download and install all of the development packages required for this project into a new `/node_modules` directory.
* **Run `bower install`**. This will read the `bower.json` file included in the root folder, then download and install all of the client packages required for this project into a new `/bower_components` directory.

*Note:* The `/node_modules` and `/bower_components` directories should never be checked in--instead, each developer will install these dependencies separately after cloning the repo. This ensures that the files in the repo aren't cluttered up by files unrelated to the project, and makes it easier to upgrade dependencies if need be.

## Developing

### Project structure:
- Any work on the app itself will occur in the `/app` directory.
- Files in the root directory are meta-files intended mainly for tools, to describe how to build and maintain the project. You mostly won't need to touch these. 

### Available Grunt tasks:
- **`grunt serve`** (alias of `grunt serve:dev`) will build the project in development mode

### To add new client packages:

Follow these steps if you need to add a new client-side dependency, such as a JavaScript library or a CSS framework.

1. **Find the package you want in Bower's registered packages [here](http://bower.io/search/)**. If you can't find it in the list, you can install it directly from a repo or a URL. Bower's docs have [instructions](http://bower.io/docs/api/#install).
* **Run `bower install <package> --save`** , where `<package>` is the name of the package you want to use.

That's it! The new package will automatically be included with the app during the build process.