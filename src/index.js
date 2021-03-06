#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const signale = require('signale')
const ora = require('ora')
const nodeHtmlToImage = require('node-html-to-image')

const pkg = require('../package.json')

require('yargs')
  .command('$0 [html] [output]', 'start the server',(yargs) => {
    yargs
      .positional('html', {
        describe: 'path to a html file',
      })
      .positional('output', {
        describe: 'path where image should be created',
      })
      .option('type', {
        alias: 't',
        type: 'string',
        default: 'png',
        description: 'type of image that should be generated'
      })
      .option('transparent', {
        type: 'boolean',
        default: false,
        description: 'determine if background of the generated image should be transparent'
      })
      .option('content', {
        alias: 'c',
        type: 'string',
        describe: 'path to a json file with the content',
      })
  }, (argv) => {
    if (!fs.existsSync(argv.html)) return signale.error('Please provide an existing HTML file path as first parameter.')
    if (!argv.output) return signale.error('Please provide an output path as second paramter.')
    if (!['png', 'jpeg'].includes(argv.type)) return signale.error('The type option should be valued to "png" or "jpeg".')

    let content
    if (argv.content) {
      try {
        content = require(path.resolve(argv.content))
      } catch (e) {
        if(e.code === 'MODULE_NOT_FOUND'){
          return signale.error(`Could not find data file ${argv.content}`)
        }
      }
    }

    const html = fs.readFileSync(argv.html).toString('utf8')
    nodeHtmlToImage({
      html,
      output: argv.output,
      content,
      type: argv.type,
      transparent: argv.transparent,
      waitUntil: argv.waitUtil||'networkidle0',
    })
      .then(() => {
      })
      .catch(e => signale.error(e))
  })
  .argv
