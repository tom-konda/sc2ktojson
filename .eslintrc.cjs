module.exports = {
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  'plugins': [
    '@typescript-eslint'
  ],
  'parser': '@typescript-eslint/parser',
  'rules': {
    'indent': ['error', 2],
    'no-var': 'error',
    'no-constant-condition': 'error',
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': 'error',
    'space-before-blocks': 'error',
    'arrow-spacing': 'error',
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off'
  }
}