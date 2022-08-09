import * as env from 'env'

export let process = {
  env: { ...env, PACKAGE_NAME }
}
