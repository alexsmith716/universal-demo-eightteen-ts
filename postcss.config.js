module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {}
  },
};

// https://www.w3.org/TR/css3-values
// https://github.com/postcss/postcss-calc

// module.exports = ({ file }) => ({
//   plugins: {
//     'postcss-import': { root: file.dirname },
//     //'postcss-flexbugs-fixes': {},
//     //'postcss-preset-env': {},
//     'autoprefixer': {},
//     //'postcss-browser-reporter': {},
//     //'postcss-reporter': {}
//   }
// })

// 'postcss-url': [
//   { filter: './**.*', url: asset => `./${asset.url}` }
// ],
