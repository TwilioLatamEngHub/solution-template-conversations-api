const packageJson = require('./package.json')

require('esbuild')
  .build({
    target: ['es6'],
    entryPoints: ['src/index.tsx'],
    bundle: true,
    minify: false,
    treeShaking: true,
    outfile: 'bundle/main.js',
    loader: {
      '.png': 'file',
      '.js': 'jsx',
    },
    define: {
      PACKAGE_NAME: `"${packageJson.name}"`,
    },
    inject: ['./bootstrap/process-shim.prod.js'],
  })
  .then((value) => {
    console.log(value)
    return value
  })
  .catch(() => process.exit(1))
