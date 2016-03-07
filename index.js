/*jslint node: true */
'use strict';

var build = require('skeleton-postcss');

build('src/skeleton.css', 'dist/skeleton.css', 'dist/skeleton.min.css');
