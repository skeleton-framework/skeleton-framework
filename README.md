# SkeletonFramework
A simple responsive framework for mobile friendly development.

## Development
To install the development dependencies run `npm install` in the project root folder.
The main css file is located in the `src` folder. 
There are three gulp tasks to help with development
* `gulp dev` - This creates a dev build of SkeletonFramework
* `gulp watch` - This watches the src file `src/skeleton.css` and runs `gulp dev` on file change
* `gulp prod` - This creates the production ready versions of SkeletonFramework, it generates a minified and non-minified version.
