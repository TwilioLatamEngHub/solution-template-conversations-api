// Constant defined on esbuild.prod.js
// it is equivalent to package.json['name']
const element = document.getElementById(PACKAGE_NAME)
const attributes = {}

for (const [key, value] of Object.entries(element.dataset)) {
  const [prefix, attributeName] = key.split('#')
  if (prefix === 'twiliodemo') {
    attributes[attributeName.toUpperCase()] = value
  }
  attributes.NODE_ENV = 'production'
  attributes.PACKAGE_NAME = PACKAGE_NAME
}

process = { env: attributes }
