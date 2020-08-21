const SkeletonPostCss = require('skeleton-postcss')
const builder = new SkeletonPostCss()

builder.build('src/skeleton.css', 'css/skeleton.css', 'css/skeleton.min.css')
