/*jslint node: true */
'use strict';

var build = require('./lib/build');

build('src/skeleton.css', 'dist/skeleton.css', 'dist/skeleton.min.css');
