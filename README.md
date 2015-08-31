# SkeletonFramework
A simple responsive framework for mobile friendly development. SkeletonFramework takes it's roots from [dhg/Skeleton](https://github.com/dhg/Skeleton), and follows the same basic principles.

## Contribution Guidelines
SkeletonFramework is a collaborative project maintained by many individuals, and you are invited to help.

## Development
To install the development dependencies run `npm install` in the project root folder.
The main css file is located in the `src` folder.
There are three gulp tasks to help with development
* `npm run dev` - This creates a dev build of SkeletonFramework
* `npm run watch` - This watches the src file `src/skeleton.css` and runs `gulp dev` on file change
* `npm run build` - This creates the production ready versions of SkeletonFramework, it generates a minified and non-minified version.
