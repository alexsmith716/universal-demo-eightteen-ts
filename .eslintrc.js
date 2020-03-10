module.exports = {
  extends: [
    'airbnb',
    // 'eslint:recommended',
    // 'plugin:react/recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'prettier',
    // 'prettier/react'
    // 'prettier/@typescript-eslint',
  ],

  env: {
    browser: true,
    // es6: true,
    jest: true,
    // node: true,
  },

  plugins: [
    // '@typescript-eslint',
    'react-hooks'
    // 'prettier',
  ],

  parser: 'babel-eslint',
  parserOptions: {
    // ecmaVersion: 2018,
    // sourceType: 'module',
    // ecmaFeatures: {
    //   jsx: true,
    // },
    allowImportExportEverywhere: true,
  },

  globals: {
    __DEVELOPMENT__: true,
    __CLIENT__: true,
    __SERVER__: true,
    __DISABLE_SSR__: true,
    __DEVTOOLS__: true,
    __DLLS__: true,
  },

  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },

  rules: {
    'no-lonely-if': 2,
    'no-nested-ternary': 2,
    'max-nested-callbacks': [2, { max: 5 }],
    'constructor-super': 2,
    'no-this-before-super': 2,
    'prefer-spread': 2,
    'arrow-parens': 0,
    'max-len': [
      'error',
      {
        code: 110,
      },
    ],
    'no-warning-comments': [1, { terms: ['todo', 'fixme'], location: 'start' }],
    'no-underscore-dangle': 'off',
    'react/sort-comp': 0,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-fragments': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-extension': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'no-param-reassign': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'import/extensions': [1, { js: 'never' }],
    'import/max-dependencies': ['error', { max: 40 }],
    'import/no-extraneous-dependencies': [0],
  },

}