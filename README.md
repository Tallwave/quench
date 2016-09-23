
# Quench
A front-end build tool to quickly spin up static web sites using Gulp, Jekyll, SASS and Bootstrap or Foundation.

## Getting started
### Before you start, install these on your machine globally
- [Node](https://nodejs.org/)
- [Jekyll](http://jekyllrb.com/)

### Setup project
1. Clone this repo to a local folder
2. `cd` to the folder in terminal
3. Choose Bootstrap or Foundation and install package by running either `npm install bootstrap-sass --save` or `npm install foundation-sites --save`
4. Run `npm install`
5. Open `gulpfile.js` and uncomment line 22 or 23 to use Bootstrap or Foundation
6. Open `assets/styles/main.scss` and uncomment the `@import` for Bootstrap or Foundation

## Build
This project uses the [Gulp](http://gulpjs.com/) task runner to manage the build process. The compiled site is generated in the `deploy` folder.

### Commands
`gulp` The default command will run all build tasks then serve the site and rebuild on changes with [Browsersync](https://www.browsersync.io/). This is the task you typically want to use when developing.

`gulp build` Runs `clean` and then all other tasks.

`gulp clean` This deletes everything in the `deploy` folder.

`gulp html` Runs Jekyll to build all html files.

`gulp css` Compiles sass, prefixes css and writes source maps.

`gulp img` Minifies images.

`gulp js` Lints, concatenates and minifies javascript files and writes source maps.

`gulp lint` Lints only `app.js` source, not bower included files.

### Production
The `--production` argument can be passed with any task. This removes source maps when compiling css and javascript. Typically this is used with the `build` command to generate final production assets.

## Structure
Here is the basic tree structure and important files
```
.
├── _config.yml              <- Jekyll config
├── .babelrc                 <- Babel settings (only used for Foundation)
├── .editorconfig            <- Code styling rules for supported editors
├── .gitignore               <- Repo excludes
├── gulpfile.js              <- Build tasks
├── package.json             <- Project dependencies
├── README.md                <- This document
├── scriptfiles.json         <- JavaScript file includes (add to and remove from build here)
├── assets
│   ├── fonts
│   ├── images
│   ├── scripts
│   │   └── main.js
│   └── styles
│       ├── _bootstrap-variables.scss
│       ├── _bootstrap.scss
│       ├── _foundation-settings.scss
│       ├── _foundation.scss
│       ├── _global.scss
│       └── main.scss                 <- Top level SASS file (import all others from here)
├── deploy                            <- Generated output
├── html
│   ├── _includes                     <- Partial template files
│   │   ├── bootstrap-navbar.html
│   │   ├── footer.html
│   │   └── foundation-topbar.html
│   ├── _layouts                      <- Top level template files
│   │   └── default.html
│   └── index.html                    <- Homepage content
```
