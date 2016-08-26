
# Quench
A front-end build tool to quickly spin up static web sites using Gulp, Jekyll, SASS and Bootstrap.

## Before you start you need these on your machine:
- [Node](https://nodejs.org/)
- [Jekyll](http://jekyllrb.com/)
- [SASS](http://sass-lang.com/)

## Setup instructions:
1. Clone this repo to a local folder
2. `cd` to the folder in terminal
3. Run `npm install`

## Build instructions:
This project uses the [Gulp](http://gulpjs.com/) task runner to manage the build process. The compiled site is generated in the `deploy` folder.

### Commands
`gulp` The default command will run all build tasks then serve the site and rebuild when files are added or changed. This is the task you typically want to use when developing.

`gulp build` Runs `clean` and then all other tasks.

`gulp clean` This deletes everything in the `deploy` folder.

`gulp html` Runs Jekyll to build all html files.

`gulp css` Compiles sass, prefixes css and writes source maps.

`gulp img` Minifies images.

`gulp js` Lints, concatenates and minifies javascript files and writes source maps.

`gulp lint` Lints only `app.js` source, not bower included files.

### Production
The `--production` argument can be passed with any task. This removes source maps when compiling css and javascript. Typically this is used with the `build` command to generate final production assets.
