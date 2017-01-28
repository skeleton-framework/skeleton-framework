/* jshint node: true, asi: true, laxcomma: true, esversion: 6 */
'use strict'

const path = require('path')
const fs = require('fs')
const Combo = require('js-combinatorics')

const postcss = require('postcss')

const custom = require('postcss-custom-properties')
const calc = require('postcss-calc')
const autopref = require('autoprefixer')
const banner = require('postcss-banner')

// common css files
const _root = fs.readFileSync('./src/core/_root.css', 'utf8')

//const root = _root + _base

// not a bone, but will get stuck at the front of each bone
const base = fs.readFileSync('./src/core/_base.css', 'utf8')

// bones
const grid    = fs.readFileSync('./src/core/_grid.css', 'utf8')
const typo    = fs.readFileSync('./src/core/_typography.css', 'utf8')
const forms   = fs.readFileSync('./src/core/_forms.css', 'utf8')
const util    = fs.readFileSync('./src/core/_utils.css', 'utf8')
const buttons = fs.readFileSync('./src/core/_buttons.css', 'utf8')
const content = fs.readFileSync('./src/core/_content.css', 'utf8')


Promise.all([
    process(_root + base,     'the base!',               'base',    'bones/base.css'),
    process(_root + grid,     'the grid!',               'grid',    'bones/grid.css'),
    process(_root + typo,     'the typo!',               'typo',    'bones/typo.css'),
    process(_root + forms,    'the form stuff!',         'forms',   'bones/forms.css'),
    process(_root + buttons,  'the buttons!',            'buttons', 'bones/buttons.css'),
    process(_root + util,     'the utility classes!',    'util',    'bones/util.css'),
    process(_root + content,  'the content... things!',  'content', 'bones/content.css')
])
    .then(bones => {
        let base = bones.shift().res.css

        let wombo = new Combo.power(bones)

        wombo.forEach(combo => {
            console.log(combo.map(postRes => postRes.name))

            let filename = combo.reduce((acc, part) => { return "-" + part.name + acc }, ".css")
            filename = filename.slice(1)

            let css = base + combo.reduce((acc, part) => { return  acc + part.res.css }, "")

            if (combo.length === 1) {
                let writepath = path.resolve(__dirname, 'bones', filename)
                fs.writeFileSync(writepath, css)
            } else if (combo.length > 1) {
                let writepath = path.resolve(__dirname, 'skeletons', filename)
                fs.writeFileSync(writepath, css)
            }
        })

    })

function process (css, _banner, name, out) {
    return postcss([
        banner({ banner: _banner }),
        custom(),
        calc({ precision: 10 }),
        autopref(),
    ])
        .process(css, { name, path: out })

        .then(res => {
            //fs.writeFileSync(out, res)
            //console.log(`Made: ${res}`)
            return { res, name }
        })

        .catch(err => {
            console.error(err)
            console.error('blarg ded')
            process.exit(1)
        })
}
