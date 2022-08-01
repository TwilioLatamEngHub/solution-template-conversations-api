const envFilePlugin = require('esbuild-envfile-plugin')

require('esbuild')
  .build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: 'bundle/main.js',
    plugins: [envFilePlugin],
    sourcemap: 'linked',
    loader: {
      '.png': 'file',
      '.js': 'jsx',
    },
    inject: ['./bootstrap/process-shim.dev.js'],
  })
  .then((value) => {
    console.log(value)
    return value
  })
  .catch(() => process.exit(1))
