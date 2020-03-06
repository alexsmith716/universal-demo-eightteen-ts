module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  parserOptions: {
    // plugins: ['typescript'],
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    allowImportExportEverywhere: true,
  },
  extends: [
    'airbnb',
    // 'eslint:recommended',
    // 'plugin:react/recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'prettier',
    // 'prettier/react'
    // 'prettier/@typescript-eslint',
  ],
  plugins: [
    // '@typescript-eslint',
    'react',
    'react-hooks'
    // 'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'arrow-parens': 0,
    'global-require': 0,
    'no-console': 0,
    'no-duplicate-imports': 0,
    'no-underscore-dangle': 0,
    // 'no-underscore-dangle': [
    //   2,
    //   {
    //     allow: ['__setExecReturnValue', '__setExecuteOnFiles', '__webpack_modules__', '__esModule'],
    //   },
    // ],
    'no-eval': 1,
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        // functions: 'never',
      },
    ],
    //
    'import/newline-after-import': 0,
    // 'import/no-default-export': 2,
    'import/no-duplicates': 2,
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    //
    'react-hooks/exhaustive-deps': 2,
    'react-hooks/rules-of-hooks': 2,
    'react/jsx-boolean-value': 1,
    'react/jsx-closing-bracket-location': 1,
    'react/jsx-closing-tag-location': 1,
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-fragments': 2,
    'react/jsx-indent': [2, 'tab'],
    'react/jsx-indent-props': [2, 'tab'],
    'react/jsx-no-useless-fragment': 2,
    'react/jsx-pascal-case': 2,
    'react/jsx-wrap-multilines': 1,
    'react/no-array-index-key': 1,
    'react/prop-types': 0,
  },
  globals: {
    __DEVELOPMENT__: true,
    __CLIENT__: true,
    __SERVER__: true,
    __DISABLE_SSR__: true,
    __DEVTOOLS__: true,
    __DLLS__: true,
  }
}