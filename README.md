# SkeletonFramework
A simple responsive framework for mobile friendly development. SkeletonFramework takes it's roots from [dhg/Skeleton](https://github.com/dhg/Skeleton), and follows the same basic principles.

## Contribution Guidelines
SkeletonFramework is a collaborative project maintained by many individuals, and you are invited to help.

Any change, update or new feature is welcome, though there are a few things that will help in getting you PR merged quicker.

1. Please do not commit the generated files in the `examples/` and `dist/` directories.
2. Give your PR a relevant and simple name that represents your changes.
3. If possible make your PR early, so that we don't end up with a heap of PR's for the same/similar thing, and so that the community can help out with it/discuss the changes.

## Development
To install the development dependencies run `npm install` in the project root folder.
The main css files is located in the `src` folder.
There are three npm scripts to help with development
* `npm run dev` - This creates a dev build of SkeletonFramework
* `npm run watch` - This watches the src file `src/skeleton.css` and runs `gulp dev` on file change
* `npm run build` - This creates the production ready versions of SkeletonFramework, it generates a minified and non-minified version.
