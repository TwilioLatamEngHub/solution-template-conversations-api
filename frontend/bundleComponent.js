const envFilePlugin = require('esbuild-envfile-plugin')
const svgrPlugin = require('esbuild-plugin-svgr')

require('esbuild')
  .build({
    target: ['es6'],
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outdir: 'dist',
    plugins: [
      envFilePlugin,
      svgrPlugin({
        exportType: 'named',
        namedExport: 'ReactComponent'
      })
    ],
    sourcemap: 'linked',
    format: 'cjs',
    loader: {
      '.png': 'file',
      '.js': 'jsx',
      '.svg': 'tsx'
    },
    define: {
      PACKAGE_NAME: '"solution"'
    },
    inject: ['./bootstrap/process-shim.dev.js'],
    external: ['react'],
    jsx: 'automatic'
  })
  .then(value => {
    console.log('Bundling successful')
    console.log(value)
    return value
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
