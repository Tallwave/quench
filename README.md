
# Quench
A front-end build tool to quickly spin up static web sites using Gulp, Jekyll, SASS and Bootstrap.

## Before you start you need these on your machine:
- [Node](https://nodejs.org/)
- [Bower](http://bower.io/)
- [Jekyll](http://jekyllrb.com/)
- [SASS](http://sass-lang.com/)

## Setup instructions:
1. Clone this repo to a local folder
2. `cd` to the folder in terminal
3. Run `bower install`
4. Run `npm install`

## Build instructions:
This project uses the [Gulp](http://gulpjs.com/) task runner to manage the build process. The compiled site is generated in the `deploy` folder.

### Commands
`gulp` The default command will compile sass, html, concatenate and minify javascript, compress images, serve the site and rebuild when files are added or changed.

`gulp clean` This deletes everything in the `deploy` folder.

`gulp html` Runs Jekyll to build all html files.

`gulp css` Compiles sass, prefixes css and writes source maps.

`gulp img` Minifies images.

`gulp js` Concatenates and minifies javascript files and writes source maps.
