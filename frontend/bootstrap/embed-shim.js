const dotenv = require('dotenv')
const fs = require('fs')
const pack = require('../package.json')

function generate(env) {
  console.log(pack.name)
  const data = ['']
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('REACT_APP')) {
      data.push(`data-twiliodemo#${key}="${value}"`)
    }
  }
  const buffer = fs.readFileSync('./embed.template.html', 'utf8')
  const template = buffer.toString()
  const html = template
    .replace('{attributes}', data.join('\n'))
    .replace('{name}', pack.name)
  fs.writeFileSync('../bundle/embed.html', html)
}

dotenv.config({ path: '../.env' })
generate(process.env)
